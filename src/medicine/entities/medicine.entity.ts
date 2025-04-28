import { MedicalPrescriptionMedicineEntity } from "../../medicalprescription/entities/medical.prescription.medicine.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('medicine')
export default class MedicineEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 400 })
  name: string;

  @Column({ type: 'varchar', length: 50, name: 'use_method' })
  useMethod: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;

  @OneToMany(() => MedicalPrescriptionMedicineEntity, (mpm) => mpm.medicalPrescription)
  prescriptions: MedicalPrescriptionMedicineEntity[];
}