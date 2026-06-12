import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean } from "class-validator";

export default class SystemSettingDto {
  @ApiProperty({ description: 'Se a impressão de receitas deve ser restrita para usuários somente leitura' })
  @IsBoolean({ message: 'restrictReadOnlyPrint deve ser um booleano' })
  restrictReadOnlyPrint: boolean;
}
