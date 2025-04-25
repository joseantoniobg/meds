import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { TokenDto } from './dto/token.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UserService,
    private configService: ConfigService
  ) {}

  private async getTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    delete user.refreshToken;
    delete user.password;

    const accessToken = this.jwtService.sign(
      {
        ...user,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: +this.configService.get<number>('JWT_EXPIRES_IN'),
      }
    );

    const refreshToken = this.jwtService.sign(
      {
        ...user,
      },
      {
        secret: this.configService.get<string>('JWT_SECRET'),
      }
    );

    return { accessToken, refreshToken };
  }

  async getPartnerApiToken(authDto: AuthCredentialsDto): Promise<TokenDto> {
    let user = await this.usersService.getByUsernameAndPassword(
      authDto.client_id,
      authDto.client_secret
    );

    if (!user) {
      throw new HttpException('Usuário ou senha inválidos', 403);
    }

    user = await this.usersService.getByIdToken(user.id);

    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    return <TokenDto>{
      access_token: accessToken,
      expires_in: +this.configService.get<number>('JWT_EXPIRES_IN'),
      token_type: 'Bearer',
      refresh_token: refreshToken,
    };
  }

  async refreshTokens(authDto: RefreshDto): Promise<TokenDto> {
    const user = await this.usersService.getByIdToken(authDto.id);

    if (!user || user.refreshToken !== authDto.refresh_token) {
      throw new HttpException('Usuário não Autorizado', 403);
    }

    const { accessToken, refreshToken } = await this.getTokens(user);

    await this.usersService.updateRefreshToken(user.id, refreshToken);

    delete user.refreshToken;

    return <TokenDto>{
      access_token: accessToken,
      expires_in: +this.configService.get<number>('JWT_EXPIRES_IN'),
      token_type: 'Bearer',
      refresh_token: refreshToken,
    };
  }
}
