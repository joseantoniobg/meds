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
import { UserModule } from '../user/user.module';
import { MedicalPrescriptionStatusEntity } from './entities/medical.prescription.status.entity';
import { MedicalPrescriptionTypeEntity } from './entities/medical.prescription.type.entity';
import { PdfModule } from '../shared/service/pdf.module';

@Module({
  imports: [TypeOrmModule.forFeature([PatientEntity, MedicineEntity,
                                      MedicalPrescriptionEntity,
                                      MedicalPrescriptionMedicineEntity,
                                      MedicalPrescriptionEmissionEntity,
                                      MedicalPrescriptionEmissionBatchEntity,
                                      MedicalPrescriptionStatusEntity,
                                      MedicalPrescriptionTypeEntity,]),
            UserModule,
            PdfModule],
  controllers: [MedicalPrescriptionController],
  providers: [MedicalPrescriptionService],
})
export class MedicalPrescriptionModule {}