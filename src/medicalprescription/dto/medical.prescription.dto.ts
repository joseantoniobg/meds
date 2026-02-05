import { IsArray, IsIn, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class Medicines {
  @IsUUID('4', { message: 'O id do medicamento deve ser um UUID' })
  id: string;

  @IsString({ message: 'A dosagem deve ser uma string' })
  @MaxLength(50, { message: 'A dosagem deve ter no máximo 50 caracteres' })
  quantity: string;

  @IsString({ message: 'A instruçào de uso deve ser uma string' })
  @MaxLength(255, { message: 'A instruçào de uso deve ter no máximo 255 caracteres' })
  instructionOfUse: string;
}

export default class MedicalPrescriptionDto {
  @IsUUID('4', { message: 'O id da receita médica deve ser um UUID' })
  @IsOptional()
  id: string;

  @IsUUID('4', { message: 'O id do paciente deve ser um UUID' })
  patientId: string;

  @IsString({ message: 'A data inicial deve ser uma string' })
  initialDate: string;

  @IsNumber({}, { message: 'A quant. de dias para renovação deve ser numérica' })
  renewal: number;

  @IsNumber({}, { message: 'O tipo da receita deve ser numérico' })
  @IsIn([1, 2, 3], { message: 'O tipo da receita deve ser 1 (padrão), 2 (azul) ou 3 (amarela)' })
  prescriptionType: number;

  @IsArray({ message: 'A lista de medicamentos deve ser um array' })
  medicines: Medicines[];
}