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
    const fetch = this.patientRepository.createQueryBuilder('patient')
    .select(['patient.id',
             'patient.name',
             'prescription.id',
             'prescription.renewal',
             'prescription.renewalDate',
             'prescription.initialDate',
             'prescription.lastPrinted',
             'typeMd.id',
             'typeMd.description',
             'status.id',
             'status.description',
             'medicine.idMedicine',
             'medicine.quantity',
             'medicine.instructionOfUse',
             'medicineEntity.id',
             'medicineEntity.name',])
    .leftJoin('patient.prescriptions', 'prescription', `prescription.id_patient = patient.id ${pagination.status ? 'and prescription.status = :statusId' : ''}`, { statusId: pagination.status })
    .leftJoin('prescription.status', 'status')
    .leftJoin('prescription.type', 'typeMd')
    .leftJoin('prescription.medicines', 'medicine')
    .leftJoin('medicine.medicine', 'medicineEntity')
    .where('patient.name LIKE :name', { name: `%${formatString(pagination.name)}%` })
    .orderBy('patient.name', 'ASC')
    .skip((pagination.page - 1) * pagination.size)
    .take(pagination.size);

    if (pagination.renewalDate) {
      fetch.andWhere('prescription.renewalDate = :renewalDate', { renewalDate: pagination.renewalDate });
    }

    if (pagination.lastPrinted) {
      fetch.andWhere('prescription.last_printed = :lastPrinted', { lastPrinted: pagination.lastPrinted });
    }

    const query = this.patientRepository.manager.connection.createQueryRunner();

    const filters = Array<any>();

    let sqlQuery = `SELECT COUNT(DISTINCT mp.id) as total
                      FROM medical_prescription mp
                      JOIN patient p ON p.id = mp.id_patient
                      WHERE p.name LIKE $1`;

    filters.push(`%${formatString(pagination.name)}%`);

    if (pagination.renewalDate) {
      sqlQuery += ` AND mp.renewal_date = $${filters.length + 1}`;
      filters.push(pagination.renewalDate);
    }

    if (pagination.lastPrinted) {
      sqlQuery += ` AND mp.last_printed = $${filters.length + 1}`;
      filters.push(pagination.lastPrinted);
    }

    const fetchedPatients = await fetch.getManyAndCount();

    const totalMeds = await query.query(sqlQuery, filters);

    return {
      content: fetchedPatients[0],
      totalRecords: fetchedPatients[1],
      totalPages: Math.ceil(fetchedPatients[1] / pagination.size),
      page: pagination.page,
      size: pagination.size,
      totalMds: +totalMeds[0].total,
    }
  }
}