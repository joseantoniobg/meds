import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Not, Repository, UpdateResult } from 'typeorm';
import { User } from './entities/user.entity';
import jwt_decode from 'jwt-decode';
import { ConfigService } from '@nestjs/config';
import { encrypt, generatePassword, getNumbersFromString, passwordMatch } from '../shared/utils/functions';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}
  async add(user: UserDto): Promise<{ id: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ login: user.login }],
    });

    if (existingUser) {
      throw new HttpException('O usuário informado já existe', 400);
    }

    user.password = await encrypt(user.password);

    const userReturn = await this.usersRepository.save(user);

    return { id: userReturn.id };
  }

  async update(user: UserDto): Promise<{ id: string }> {
    const existingUser = await this.usersRepository.findOne({
      where: [{ id: user.id }],
    });

    if (!existingUser) {
      throw new HttpException('Usuário não encontrado', 400);
    }

    if (user.password) {
      user.password = await encrypt(user.password);
    }

    const otherUserWithSameEmailOrLogin = await this.usersRepository.findOne({
      where: [
        { login: user.login, id: Not(user.id) },
      ],
    });

    if (otherUserWithSameEmailOrLogin) {
      throw new HttpException(
        'Usuário já cadastrado',
        400
      );
    }

    const userReturn = await this.usersRepository.save(user);

    return { id: userReturn.id };
  }

  async updateRefreshToken(id: string, refreshToken: string): Promise<boolean> {
    await this.usersRepository.update(id, { refreshToken });
    return true;
  }

  async getByUsernameAndPassword(username: string, password: string): Promise<User> {
    const existingUser = await this.usersRepository.findOne(
      { where: { login: username, status: 1 }, select: ['id', 'password'] }
    );

    if (existingUser) {
      const match = await passwordMatch(existingUser.password, password);
      if (match) {
        delete existingUser.password;
        return existingUser;
      }
    }
    return null;
  }

  async getById(id: string): Promise<User> {
    const existingUser = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
    delete existingUser.password;
    delete existingUser.refreshToken;

    return existingUser;
  }

  async getByIdToken(id: string): Promise<User> {
    const existingUser = await this.usersRepository
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.login',
        'user.name',
        'user.refreshToken',
        'user.updatePassword',
        'user.readOnly',
      ])
      .where('user.id = :id AND user.status = :status', { id, status: 1 })
      .getOne();

    if (!existingUser) {
      return null;
    }

    return existingUser;
  }
}
