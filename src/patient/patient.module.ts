import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import PatientEntity from './entities/patient.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity])],
  controllers: [PatientController],
  providers: [PatientService]
})
export class PatientModule {}