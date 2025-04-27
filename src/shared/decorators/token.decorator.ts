import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const TokenPayload = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    return jwt.decode(token);
  },
);
