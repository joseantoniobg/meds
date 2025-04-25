import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { AccessTokenGuard } from '../shared/guards/access.token.guard';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private userService: UserService) {}

  @Post('')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: 201,
    description: 'Gera um novo usuário e devolve seu ID gerado',
  })
  async create(@Body() newUser: UserDto) {
    return this.userService.add(newUser);
  }

  @Put('')
  @UseGuards(AccessTokenGuard)
  @ApiResponse({
    status: 201,
    description: 'Atualiza o usuário',
  })
  async update(@Body() newUser: UserDto) {
    return this.userService.update(newUser);
  }

  @Get('/id/:id')
  @ApiResponse({
    status: 200,
    type: [User],
    description: 'Busca o usuário pelo id',
  })
  @UseGuards(AccessTokenGuard)
  async getById(@Param('id') id: string, @Req() request) {
    return this.userService.getById(id, request.user.user);
  }

  @Get('/me')
  @ApiResponse({
    status: 200,
    type: User,
    description: 'Gets the user by the authorization header',
  })
  @UseGuards(AccessTokenGuard)
  async getUserFromToken(@Headers() headers) {
    return this.userService.getByIdToken(headers.authorization);
  }
}
