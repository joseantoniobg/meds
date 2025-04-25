import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalPrescriptionController } from './medical.prescription.controller';
import { MedicalPrescriptionService } from './medical.prescription.service';
import MedicineEntity from '../medicine/entities/medicine.entity';
import { MedicalPrescriptionEntity } from './entities/medical.prescription.entity';
import { MedicalPrescriptionMedicineEntity } from './entities/medical.prescription.medicine.entity';
import PatientEntity from '../patient/entities/patient.entity';
import { MedicalPrescriptionEmissionEntity } from './entities/medical.prescription.emission.dto';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, MedicineEntity, MedicalPrescriptionEntity, MedicalPrescriptionMedicineEntity, MedicalPrescriptionEmissionEntity])],
  controllers: [MedicalPrescriptionController],
  providers: [MedicalPrescriptionService]
})
export class MedicalPrescriptionModule {}