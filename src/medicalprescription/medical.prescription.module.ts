import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalPrescriptionController } from './medical.prescription.controller';
import { MedicalPrescriptionService } from './medical.prescription.service';
import MedicineEntity from '../medicine/entities/medicine.entity';
import { MedicalPrescriptionEntity } from './entities/medical.prescription.entity';
import { MedicalPrescriptionMedicineEntity } from './entities/medical.prescription.medicine.entity';
import PatientEntity from '../patient/entities/patient.entity';
import { MedicalPrescriptionEmissionEntity } from './entities/medical.prescription.emission.entity';
import { HolidayEntity } from './entities/holiday.entity';
import { MedicalPrescriptionEmissionBatchEntity } from './entities/medical.prescription.emission.batch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, MedicineEntity,
                                      MedicalPrescriptionEntity, MedicalPrescriptionMedicineEntity,
                                      MedicalPrescriptionEmissionEntity,
                                      MedicalPrescriptionEmissionBatchEntity,])],
  controllers: [MedicalPrescriptionController],
  providers: [MedicalPrescriptionService]
})
export class MedicalPrescriptionModule {}