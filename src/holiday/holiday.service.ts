import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HolidayEntity } from '../medicalprescription/entities/holiday.entity';
import HolidayDto from './dto/holiday.dto';
import HolidayFiltersDto from './dto/holiday.filters.dto';
import { PageResponseDto } from '../shared/dto/page.response.dto';
import { formatString } from '../shared/utils/functions';

@Injectable()
export class HolidayService {
  constructor(@InjectRepository(HolidayEntity) private readonly holidayRepository: Repository<HolidayEntity>) {}

  async create(holidayDto: HolidayDto): Promise<HolidayEntity> {
    const newHoliday = this.holidayRepository.create({
      date: holidayDto.date,
      description: formatString(holidayDto.description),
    });

    return await this.holidayRepository.save(newHoliday);
  }

  async update(date: Date, holidayDto: HolidayDto): Promise<HolidayEntity> {
    const holiday = await this.holidayRepository.findOne({ where: { date } });
    if (!holiday) {
      throw new HttpException('Holiday not found', 404);
    }

    holiday.description = formatString(holidayDto.description);

    return this.holidayRepository.save(holiday);
  }

  async delete(date: Date): Promise<void> {
    const holiday = await this.holidayRepository.findOne({ where: { date } });
    if (!holiday) {
      throw new HttpException('Holiday not found', 404);
    }

    await this.holidayRepository.delete({ date });
  }

  async findHolidays(filters: HolidayFiltersDto): Promise<PageResponseDto<HolidayEntity>> {
    const fetch = this.holidayRepository
      .createQueryBuilder('holiday')
      .where('holiday.description LIKE :description', { description: `%${formatString(filters.description)}%` })
      .orderBy('holiday.date', 'ASC')
      .skip((filters.page - 1) * filters.size)
      .take(filters.size);

    if (filters.date) {
      fetch.andWhere('holiday.date = :date', { date: filters.date });
    }

    const fetched = await fetch.getManyAndCount();

    return {
      content: fetched[0],
      totalRecords: fetched[1],
      totalPages: Math.ceil(fetched[1] / filters.size),
      page: filters.page,
      size: filters.size,
    };
  }
}
