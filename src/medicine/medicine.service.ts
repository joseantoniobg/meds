import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import MedicineEntity from './entities/medicine.entity';
import MedicineDto from './dto/medicine.dto';
import MedicineFiltersDto from './dto/medicine.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { formatString } from '../shared/utils/functions';

@Injectable()
export class MedicineService {
  constructor(@InjectRepository(MedicineEntity) private readonly medicineRepository: Repository<MedicineEntity>) {}

  async create(medicineDto: MedicineDto): Promise<MedicineEntity> {
    medicineDto.name = formatString(medicineDto.name);
    medicineDto.useMethod = formatString(medicineDto.useMethod);
    const newMedicine = this.medicineRepository.create(medicineDto);
    return await this.medicineRepository.save(newMedicine);
  }

  async update(id: string, medicineDto: MedicineDto): Promise<MedicineEntity> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new HttpException('Medicine not found', 404);
    }

    medicine.name = formatString(medicineDto.name);
    medicine.useMethod = formatString(medicineDto.useMethod);

    return this.medicineRepository.save(medicine);
  }

  async delete(id: string): Promise<void> {
    const medicine = await this.medicineRepository.findOne({ where: { id } });
    if (!medicine) {
      throw new HttpException('Medicine not found', 404);
    }

    await this.medicineRepository.softDelete(id);
  }

  async findMedicinesByName(pagination: MedicineFiltersDto): Promise<PageResponseDto<MedicineEntity>> {
    const fetchedMedicines = await this.medicineRepository.findAndCount({
      skip: (pagination.page - 1) * pagination.size,
      take: pagination.size,
      where: { name: Like(`%${pagination.name.toUpperCase()}%`) },
      order: { name: 'ASC' },
    });

    return {
      content: fetchedMedicines[0],
      totalRecords: fetchedMedicines[1],
      totalPages: Math.ceil(fetchedMedicines[1] / pagination.size),
      page: pagination.page,
      size: pagination.size,
    }
  }
}