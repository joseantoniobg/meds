import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MedicalPrescriptionEntity } from "./medical.prescription.entity";

@Entity('medical_prescription_emission_batch')
export class MedicalPrescriptionEmissionBatchEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'is_daily_emission', type: 'bool', default: false })
  isDailyEmission: boolean;

  @Column({ type: 'date', name: 'date' })
  date: Date;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;
}