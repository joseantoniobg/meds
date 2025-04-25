import { ApiProperty } from '@nestjs/swagger';

export class TokenDto {
  @ApiProperty({
    description: 'The token to acess the services',
    example: '4789fu89furw8989uv89r...',
  })
  access_token: string;
  @ApiProperty({
    description: 'The refresh token to refresh the access token',
    example: '4789fu89furw8989uv89r...',
  })
  refresh_token: string;
  @ApiProperty({
    description: 'The amount of seconds till the token expires',
    example: 3600,
  })
  expires_in: number;
  @ApiProperty({
    description: 'The token type, fixed "Bearer"',
    example: 'Bearer',
  })
  token_type: string;
}
