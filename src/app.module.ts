import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { DatabasePostgresConfig } from './shared/database/database.postgres.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientModule } from './patient/patient.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MedicineModule } from './medicine/medicine.module';
import { MedicalPrescriptionEntity } from './medicalprescription/entities/medical.prescription.entity';
import { MedicalPrescriptionModule } from './medicalprescription/medical.prescription.module';

@Module({
  imports: [ ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({ useClass: DatabasePostgresConfig }),
    AuthModule,
    PatientModule,
    MedicineModule,
    UserModule,
    MedicalPrescriptionModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
