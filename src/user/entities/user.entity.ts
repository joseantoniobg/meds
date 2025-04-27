import { ApiProperty } from '@nestjs/swagger';

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
@Index(['login', 'password'])
export class User {
  @ApiProperty({
    description: 'ID do usuário gerado automaticamente',
    example: '6b5abe8c-a71f-4945-a9e8-90859472c50c',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    description: 'Login',
    example: 'joseantonio',
  })
  @Index('ix_login', { unique: true })
  @Column({ type: 'varchar', length: 50 })
  login: string;

  @ApiProperty({
    description: 'Nome',
    example: 'jose antonio',
  })
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  crm: string;

  @ApiProperty({
    description: 'Status (1 - ativo, 0 - inativo)',
    example: 1,
  })
  @Column({ type: 'int2', default: 1 })
  status: number;

  @ApiProperty({
    description: 'user password',
    example: 'vcuhwiufgyhwiru37y32978y2',
  })
  @Column({ type: 'varchar', length: 256 })
  password: string;

  @ApiProperty({
    description: 'refresh token para validação',
    example: 'vcuhwiufgyhwiru37y32978y2...',
  })
  @Column({ name: 'refresh_token', type: 'text', nullable: true })
  refreshToken: string;

  @ApiProperty({
    description: 'Indica troca de senha no primeiro acesso',
    example: true,
    default: true,
  })
  @Column({ name: 'update_password', type: 'bool', default: true })
  updatePassword: boolean;

  @ApiProperty({
    description: 'data do cancelamnto/descontinuação do usuário',
  })
  @Column({ type: 'timestamp with time zone', nullable: true })
  cancelled_at: Date;

  @ApiProperty({
    description: 'data hora de criação do usuário',
  })
  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'data hora de última atualização do usuário',
  })
  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ApiProperty({
    description: 'data hora de delete do usuário',
    required: false,
  })
  @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at' })
  deletedAt: Date;
}
