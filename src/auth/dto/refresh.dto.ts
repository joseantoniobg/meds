import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class RefreshDto {
  @ApiProperty({ description: 'The user id', example: '1bd494b4-1ccd-44b7-9dc6-231aa794b283' })
  @IsString()
  id: string;
  @ApiProperty({ description: 'The refresh token', example: 'fh94h794h97h9...' })
  @IsString()
  refresh_token: string;
}
