import { Transform } from "class-transformer";
import { IsString, MaxLength } from "class-validator";

export default class MedicineDto {
  @IsString({ message: 'O nome deve ser uma string' })
  @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres' })
  name: string;

  @IsString({ message: 'O método de uso deve ser uma string' })
  @MaxLength(50, { message: 'O método de uso deve ter no máximo 50 caracteres' })
  useMethod: string;
}