import { IsIn, IsNumber, IsUUID } from "class-validator";

export default class UpdatePrescriptionTypeDto {
  @IsUUID('4', { message: 'O id da receita médica deve ser um UUID' })
  id: string;

  @IsNumber({}, { message: 'O tipo da receita deve ser numérico' })
  @IsIn([1, 2, 3], { message: 'O tipo da receita deve ser 1 (padrão), 2 (azul) ou 3 (amarela)' })
  prescriptionType: number;
}
