import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsOptional, IsUUID } from "class-validator";
import { PageFilterDto } from "../../shared/dto/page.filter.dto";
import { Transform } from "class-transformer";

export default class EmitMedicalPrescriptionFiltersDto extends PageFilterDto {
  @ApiProperty({ description: 'Ids da receita médicas' })
  @Transform(({ value }) => value.split(','))
  @IsArray({ message: 'Ids da Receitas deve ser um array' })
  @IsOptional()
  medicalPrescriptionIds: string[];

  @ApiProperty({ description: 'Data da receita médica' })
  date: Date;

  @ApiProperty({ description: 'Status da Receita' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  status?: number;

  @ApiProperty({ description: 'Se é a emissão deve atualizar a data de renovação' })
  @Transform(({ value }) => value === 'true')
  print?: boolean;

  @ApiProperty({ description: 'A quantidade de dias para renovação' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  renewal?: number;

  @ApiProperty({ description: 'Se é a emissão automática diária (renovação das receitas)' })
  @Transform(({ value }) => value === 'true')
  dailyEmission: boolean;

  @ApiProperty({ description: 'ID do paciente' })
  @IsUUID('4', { message: 'Id do paciente deve ser um UUID' })
  @IsOptional()
  patientId: string;
}