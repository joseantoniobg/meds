import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsString, MaxLength } from "class-validator";

export default class HolidayDto {
  @ApiProperty({ description: 'Data do feriado (YYYY-MM-DD)' })
  @IsDateString({}, { message: 'A data deve ser uma data válida' })
  date: string;

  @ApiProperty({ description: 'Descrição do feriado', maxLength: 50 })
  @IsString({ message: 'A descrição deve ser uma string' })
  @MaxLength(50, { message: 'A descrição deve ter no máximo 50 caracteres' })
  description: string;
}
