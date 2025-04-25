import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, MaxLength } from "class-validator";

export class UserDto {
  @ApiProperty({
    description: "User ID",
    example: "12345",
  })
  id: string;

  @ApiProperty({
    description: "User name",
    example: "John Doe",
  })
  @IsString({ message: "O nome deve ser uma string" })
  @MaxLength(50, { message: "O nome deve ter no máximo 50 caracteres" })
  name: string;

  @ApiProperty({
    description: "User login",
    example: "johndoe",
  })
  @IsString({ message: "O login deve ser uma string" })
  @MaxLength(50, { message: "O login deve ter no máximo 50 caracteres" })
  login: string;

  @ApiProperty({
    description: "User password",
    example: "password123",
  })
  @IsString({ message: "A senha deve ser uma string" })
  @MaxLength(256, { message: "A senha deve ter no máximo 256 caracteres" })
  @IsOptional()
  password: string;
}