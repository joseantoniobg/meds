import PatientEntity from "../../patient/entities/patient.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MedicalPrescriptionMedicineEntity } from "./medical.prescription.medicine.entity";
import { MedicalPrescriptionEntity } from "./medical.prescription.entity";

@Entity('medical_prescription_emission')
export class MedicalPrescriptionEmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_batch', type: 'uuid' })
  batchId: string;

  @Column({ name: 'is_daily_emission', type: 'bool', default: false })
  isDailyEmission: boolean;

  @Column({ name: 'id_medical_prescription', type: 'uuid' })
  medicalPrescriptionId: string;

  @ManyToOne(() => MedicalPrescriptionEntity, (mp) => mp.id, { nullable: false })
  @JoinColumn({ name: 'id_medical_prescription', referencedColumnName: 'id' })
  medicalPrescription: MedicalPrescriptionEntity;

  @Column({ type: 'date', name: 'initial_date' })
  date: Date;

  @Column({ type: 'varchar', length: 2500 })
  html: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}