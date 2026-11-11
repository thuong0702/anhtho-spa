import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { timingSafeEqual } from 'node:crypto';
import type { Request } from 'express';

@Injectable()
export class AdminKeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const configuredKey = process.env.ADMIN_API_KEY;
    if (!configuredKey) {
      throw new ForbiddenException('Admin API chưa được cấu hình ADMIN_API_KEY.');
    }

    const request = context.switchToHttp().getRequest<Request>();
    const suppliedKey = request.header('x-admin-api-key') ?? '';
    const expected = Buffer.from(configuredKey);
    const supplied = Buffer.from(suppliedKey);
    if (
      expected.length !== supplied.length ||
      !timingSafeEqual(expected, supplied)
    ) {
      throw new UnauthorizedException('Admin API key không hợp lệ.');
    }
    return true;
  }
}
