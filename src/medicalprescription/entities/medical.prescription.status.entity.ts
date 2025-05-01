import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('medical_prescription_status')
export class MedicalPrescriptionStatusEntity {
  @PrimaryColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;
}
