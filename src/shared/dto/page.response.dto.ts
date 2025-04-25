import { ApiProperty } from "@nestjs/swagger";

export class PageResponseDto<T> {
  @ApiProperty({
    type: Object,
    description: 'Lista de Objetos retornados',
    example: []
  })
  content: T[];

  @ApiProperty({
    type: Number,
    description: 'Número da página',
    example: 1
  })
  page: number;

  @ApiProperty({
    type: Number,
    description: 'Tamanho da página',
    example: 10
  })
  size: number;

  @ApiProperty({
    type: Number,
    description: 'Total de páginas',
    example: 1
  })
  totalPages: number;

  @ApiProperty({
    type: Number,
    description: 'Total de registros',
    example: 1
  })
  totalRecords: number;
}