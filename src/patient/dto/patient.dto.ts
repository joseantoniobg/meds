import { Transform } from "class-transformer";
import { IsString, MaxLength } from "class-validator";

export default class PatientDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(50, { message: 'O nome deve ter no máximo 50 caracteres' })
  name: string;
}