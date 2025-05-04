import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { MedicalPrescriptionEntity } from "./medical.prescription.entity";
import { MedicalPrescriptionEmissionBatchEntity } from "./medical.prescription.emission.batch.entity";

@Entity('medical_prescription_emission')
export class MedicalPrescriptionEmissionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_batch', type: 'uuid' })
  batchId: string;

  @ManyToOne(() => MedicalPrescriptionEmissionBatchEntity, (mp) => mp.id, { nullable: false })
  @JoinColumn({ name: 'id_batch', referencedColumnName: 'id' })
  medicalPrescriptionBatch: MedicalPrescriptionEmissionBatchEntity;

  @Column({ name: 'id_medical_prescription', type: 'uuid' })
  medicalPrescriptionId: string;

  @ManyToOne(() => MedicalPrescriptionEntity, (mp) => mp.id, { nullable: false })
  @JoinColumn({ name: 'id_medical_prescription', referencedColumnName: 'id' })
  medicalPrescription: MedicalPrescriptionEntity;

  @Column({ type: 'varchar', length: 8000 })
  html: string;
}