import { ApiProperty } from "@nestjs/swagger";
import { PageFilterDto } from "../../shared/dto/page.filter.dto";
import { IsOptional, IsUUID } from "class-validator";
import { Transform } from "class-transformer";

export class MedicalPrescriptionFiltersDto extends PageFilterDto {
  @ApiProperty({ description: 'ID do paciente' })
  @IsOptional()
  @IsUUID('4', { message: 'O id do paciente deve ser um UUID' })
  patientId: string;

  @ApiProperty({ description: 'ID do medicamento' })
  @IsOptional()
  @IsUUID('4', { message: 'O id do medicamento deve ser um UUID' })
  medicineId: string;

  @ApiProperty({ description: 'Receitas para emissão diária' })
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  dailyEmission: boolean;
}