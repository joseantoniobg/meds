import PatientEntity from "../../patient/entities/patient.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MedicalPrescriptionMedicineEntity } from "./medical.prescription.medicine.entity";

@Entity('medical_prescription')
export class MedicalPrescriptionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'id_patient', type: 'uuid' })
  patientId: string;

  @ManyToOne(() => PatientEntity, (patient) => patient.id, { nullable: false })
  @JoinColumn({ name: 'id_patient', referencedColumnName: 'id' })
  patient: PatientEntity;

  @Column({ type: 'date', name: 'initial_date' })
  initialDate: Date;

  @Column({ type: 'int' })
  renewal: number;

  @Column({ type: 'smallint', default: 1 })
  status: number;

  @OneToMany(() => MedicalPrescriptionMedicineEntity, (mpm) => mpm.medicalPrescription)
  medicines: MedicalPrescriptionMedicineEntity[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}