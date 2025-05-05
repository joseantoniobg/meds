import {
  Column,
  Entity,
  PrimaryColumn,
} from 'typeorm';

@Entity('medical_prescription_type')
export class MedicalPrescriptionTypeEntity {
  @PrimaryColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'varchar', length: 50 })
  description: string;
}
