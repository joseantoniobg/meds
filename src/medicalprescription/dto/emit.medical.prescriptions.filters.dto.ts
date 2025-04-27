import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsUUID } from "class-validator";
import { PageFilterDto } from "../../shared/dto/page.filter.dto";
import { Transform } from "class-transformer";

export default class EmitMedicalPrescriptionFiltersDto extends PageFilterDto {
  @ApiProperty({ description: 'Id da receita médica' })
  @IsUUID('4', { message: 'Id da Receita deve ser um UUID' })
  @IsOptional()
  medicalPrescriptionId: string;

  @ApiProperty({ description: 'Data da receita médica' })
  date: Date;

  @ApiProperty({ description: 'Se é a emissão automática diária (renovação das receitas)' })
  @Transform(({ value }) => value === 'true')
  dailyEmission: boolean;

  @ApiProperty({ description: 'ID do paciente' })
  @IsUUID('4', { message: 'Id do paciente deve ser um UUID' })
  @IsOptional()
  patientId: string;
}