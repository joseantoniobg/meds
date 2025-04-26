import { ApiProperty } from "@nestjs/swagger";

export default class MedicalPrescriptionEmissionDto {
  @ApiProperty({ description: 'ID da receita médica' })
  id: string;

  @ApiProperty({ description: 'HTML da receita médica' })
  html: string;
}