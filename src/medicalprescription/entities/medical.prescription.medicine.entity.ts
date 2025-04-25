import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, PrimaryColumn } from 'typeorm';
import { MedicalPrescriptionEntity } from './medical.prescription.entity';
import MedicineEntity from '../../medicine/entities/medicine.entity';

@Entity('medical_prescription_medicine')
export class MedicalPrescriptionMedicineEntity {
  @PrimaryColumn('uuid', { name: 'id_medical_prescription' })
  idMedicalPrescription: string;

  @ManyToOne(() => MedicalPrescriptionEntity, (mp) => mp.medicines)
  @JoinColumn({ name: 'id_medical_prescription', referencedColumnName: 'id' })
  medicalPrescription: MedicalPrescriptionEntity;

  @PrimaryColumn('uuid', { name: 'id_medicine' })
  idMedicine: string;

  @ManyToOne(() => MedicineEntity, (medicine) => medicine.prescriptions)
  @JoinColumn({ name: 'id_medicine', referencedColumnName: 'id' })
  medicine: MedicineEntity;

  @Column({ type: 'varchar', length: 255, name: 'instruction_of_use' })
  instructionOfUse: string;

  @Column({ type: 'varchar', length: 30 })
  quantity: string;
}
