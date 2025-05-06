import { BadRequestException, Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { MeUseCase } from 'src/domain/application/use-cases/user/me.use-case';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerMeDto } from '../../dto/user/me.dto';
import { MeViewModel } from '../../view-model/user/me.view-model';

@ApiTags('User')
@Controller('user')
export class MeController {
  constructor(private readonly meUseCase: MeUseCase) {}

  @SwaggerMeDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/me')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const user = await this.meUseCase.execute({
      id: new UniqueEntityId(sub),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return MeViewModel.toHttp(user.value);
  }
}
