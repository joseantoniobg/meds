import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class AuthCredentialsDto {
  @ApiProperty({ description: 'The client id', example: 'test-pix' })
  @IsString()
  client_id: string;
  @ApiProperty({ description: 'The client secret', example: 'fh94h794h97h9' })
  @IsString()
  client_secret: string;
  @ApiProperty({
    description: 'The grant type, fixed "client_credentials"',
    example: 'client_credentials',
  })
  @IsString()
  grant_type: string;
}
