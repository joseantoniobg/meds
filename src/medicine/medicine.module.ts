import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PatientEntity from './entities/medicine.entity';
import { MedicineController } from './medicine.controller';
import { MedicineService } from './medicine.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  controllers: [MedicineController],
  providers: [MedicineService]
})
export class MedicineModule {}