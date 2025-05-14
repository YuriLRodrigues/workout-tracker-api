import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { ChangeMyUserPasswordUseCase } from '@root/domain/application/use-cases/user/change-my-password';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { ChangeMyUserPasswordBodyDto, SwaggerChangeMyUserPasswordDto } from '../../dto/user/change-my-password.dto';

@ApiTags('User')
@Controller('user')
export class ChangeMyUserPasswordController {
  constructor(private readonly changeMyUserPasswordUseCase: ChangeMyUserPasswordUseCase) {}

  @SwaggerChangeMyUserPasswordDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Patch('/change-password')
  async handle(@CurrentUser() payload: UserPayload, @Body() { newPassword, oldPassword }: ChangeMyUserPasswordBodyDto) {
    const { sub } = payload;

    const user = await this.changeMyUserPasswordUseCase.execute({
      userId: new UniqueEntityId(sub),
      newPassword,
      oldPassword,
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            error: error.message,
          });
        case ResourceAlreadyExistsError:
          throw new ConflictException({
            statusCode: HttpStatus.CONFLICT,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      message: 'Password successfully modified',
    };
  }
}
