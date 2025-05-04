import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import PatientEntity from './entities/patient.entity';
import PatientDto from './dto/patient.dto';
import PatientFiltersDto from './dto/patient.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { formatString } from '../shared/utils/functions';

@Injectable()
export class PatientService {
  constructor(@InjectRepository(PatientEntity) private readonly patientRepository: Repository<PatientEntity>) {}

  async create(patientDto: PatientDto): Promise<PatientEntity> {
    patientDto.name = formatString(patientDto.name);
    const newPatient = this.patientRepository.create(patientDto);
    return await this.patientRepository.save(newPatient);
  }

  async update(id: string, patientDto: PatientDto): Promise<PatientEntity> {
    patientDto.name = formatString(patientDto.name);
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new HttpException('Patient not found', 404);
    }

    patient.name = patientDto.name.trim().toUpperCase();
    return this.patientRepository.save(patient);
  }

  async delete(id: string): Promise<void> {
    const patient = await this.patientRepository.findOne({ where: { id } });
    if (!patient) {
      throw new HttpException('Patient not found', 404);
    }

    await this.patientRepository.softDelete(id);
  }

  async findPatientsByName(pagination: PatientFiltersDto): Promise<PageResponseDto<PatientEntity>> {
    const fetchedPatients = await this.patientRepository.createQueryBuilder('patient')
    .select(['patient.id',
             'patient.name',
             'prescription.id',
             'prescription.renewal',
             'prescription.initialDate',
             'status.id',
             'status.description',
             'medicine.idMedicine',
             'medicine.quantity',
             'medicine.instructionOfUse',
             'medicineEntity.id',
             'medicineEntity.name',])
    .leftJoin('patient.prescriptions', 'prescription', `${pagination.status ? 'prescription.status = :statusId' : ''}`, { statusId: pagination.status })
    .leftJoin('prescription.status', 'status')
    .leftJoin('prescription.medicines', 'medicine')
    .leftJoin('medicine.medicine', 'medicineEntity')
    .where('patient.name LIKE :name', { name: `%${formatString(pagination.name)}%` })
    .orderBy('patient.name', 'ASC')
    .skip((pagination.page - 1) * pagination.size)
    .take(pagination.size)
    .getManyAndCount();

    return {
      content: fetchedPatients[0],
      totalRecords: fetchedPatients[1],
      totalPages: Math.ceil(fetchedPatients[1] / pagination.size),
      page: pagination.page,
      size: pagination.size,
    }
  }
}