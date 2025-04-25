import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, Min } from "class-validator";

export class PageFilterDto {
    @ApiProperty({
        type: Number,
        description: 'Número da página',
        example: 1
    })
    @Transform(({value}) => parseInt(value))
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false }, { message: 'O campo page deve ser um número' })
    @Min(1, { message: 'O campo page deve ser maior que 0' })
    page: number;

    @ApiProperty({
        type: Number,
        description: 'Tamanho da página',
        example: 10
    })
    @Transform(({value}) => parseInt(value))
    @IsNumber({ maxDecimalPlaces: 0, allowNaN: false, allowInfinity: false }, { message: 'O campo size deve ser um número' })
    @Min(1, { message: 'O campo size deve ser maior que 0' })
    size: number;
}