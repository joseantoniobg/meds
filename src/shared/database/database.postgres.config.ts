import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class DatabasePostgresConfig implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      name: 'default',
      type: 'postgres',
      host: this.configService.get<string>('TYPEORM_HOST'),
      port: Number(this.configService.get<number>('TYPEORM_PORT')),
      username: this.configService.get<string>('TYPEORM_USERNAME'),
      password: this.configService.get<string>('TYPEORM_PASSWORD'),
      database: this.configService.get<string>('TYPEORM_DATABASE'),
      entities: [this.configService.get<string>('TYPEORM_ENTITIES')],
      migrations: [__dirname + this.configService.get<string>('TYPEORM_MIGRATIONS')],
      extra: {
        options: '-c TimeZone=America/Sao_Paulo',
        max: 100,
        allowExitOnIdle: true,
        connectionTimeoutMillis: 60000,
      },
      ssl: true,
    };
  }
}