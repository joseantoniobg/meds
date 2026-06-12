import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('system_settings')
export class SystemSettingEntity {
  @PrimaryColumn({ type: 'smallint', name: 'id' })
  id: number;

  @Column({ type: 'boolean', name: 'restrict_read_only_print' })
  restrictReadOnlyPrint: boolean;
}
