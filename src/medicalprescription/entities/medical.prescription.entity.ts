import PatientEntity from '../../patient/entities/patient.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MedicalPrescriptionMedicineEntity } from './medical.prescription.medicine.entity';
import { User } from '../../user/entities/user.entity';
import { MedicalPrescriptionStatusEntity } from './medical.prescription.status.entity';
import { MedicalPrescriptionTypeEntity } from './medical.prescription.type.entity';

@Entity('medical_prescription')
export class MedicalPrescriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_patient', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.id, { nullable: false })
  @JoinColumn({ name: 'id_patient', referencedColumnName: 'id' })
  patient: PatientEntity;

  @Column({ name: 'id_user', type: 'uuid' })
  userId: string;

  @ManyToOne(() => User, (user) => user.id, { nullable: false })
  @JoinColumn({ name: 'id_user', referencedColumnName: 'id' })
  user: User;

  @Column({ type: 'date', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'date', name: 'last_printed', nullable: true })
  lastPrinted: Date;

  @Column({ type: 'int' })
  renewal: number;

  @Column({ type: 'smallint', default: 1, name: 'status' })
  statusId: number;

  @ManyToOne(
    () => MedicalPrescriptionStatusEntity,
    (status) => status.id,
  )
  @JoinColumn({ name: 'status', referencedColumnName: 'id' })
  status: MedicalPrescriptionStatusEntity;

  @Column({ type: 'smallint', nullable: true, name: 'id_type', default: 1 })
  typeId: number;

  @ManyToOne(
    () => MedicalPrescriptionTypeEntity,
    (type) => type.id,
  )
  @JoinColumn({ name: 'id_type', referencedColumnName: 'id' })
  type: MedicalPrescriptionTypeEntity;

  @OneToMany(
    () => MedicalPrescriptionMedicineEntity,
    (mpm) => mpm.medicalPrescription,
  )
  @JoinColumn({ name: 'id', referencedColumnName: 'id_medical_prescription' })
  medicines: MedicalPrescriptionMedicineEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}
