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
    const fetchedPatients = await this.patientRepository.findAndCount({
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      select: {
        id: true,
        name: true,
        prescriptions: {
          id: true,
          initialDate: true,
          renewal: true,
          medicines: {
            instructionOfUse: true,
            quantity: true,
            medicine: {
              id: true,
              name: true,
              useMethod: true,
            },
          },
        }
      },
      where: { name: Like(`%${pagination.name.toUpperCase()}%`) },
      order: { name: 'ASC' },
      relations: ['prescriptions', 'prescriptions.medicines', 'prescriptions.medicines.medicine'],
    });

    return {
      content: fetchedPatients[0],
      totalRecords: fetchedPatients[1],
      totalPages: Math.ceil(fetchedPatients[1] / pagination.size),
      page: pagination.page,
      size: pagination.size,
    }
  }
}