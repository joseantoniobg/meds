import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Set your JWT secret here
      signOptions: { expiresIn: '60s' }, // Token expiration time
    }),
    UserModule,
  ],
  providers: [JwtStrategy, AuthService],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
