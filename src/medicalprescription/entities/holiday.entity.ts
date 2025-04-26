import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity('holiday')
export class HolidayEntity {
  @PrimaryColumn({ type: 'date', name: 'date' })
  date: Date;

  @Column({ name: 'description', type: 'varchar', length: 50 })
  description: string;
}