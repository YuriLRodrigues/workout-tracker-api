import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserPayload } from '../auth/auth-user';
import { IS_PUBLIC_KEY } from '../auth/public';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class PlanActiveGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const user: UserPayload = context.switchToHttp().getRequest()?.user;

    if (!user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const plan = await this.prisma.plan.findUnique({
      where: {
        userId: user.sub,
      },
    });

    if (!plan) {
      throw new ForbiddenException('Nenhum plano encontrado');
    }

    if (new Date() > plan.expiresAt) {
      throw new ForbiddenException('Seu plano expirou');
    }

    return true;
  }
}
