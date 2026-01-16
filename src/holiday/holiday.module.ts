import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HolidayEntity } from '../medicalprescription/entities/holiday.entity';
import { HolidayController } from './holiday.controller';
import { HolidayService } from './holiday.service';

@Module({
  imports: [TypeOrmModule.forFeature([HolidayEntity])],
  controllers: [HolidayController],
  providers: [HolidayService],
})
export class HolidayModule {}
