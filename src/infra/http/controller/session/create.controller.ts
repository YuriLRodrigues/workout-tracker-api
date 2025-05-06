import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { CreateSessionUseCase } from '@root/domain/application/use-cases/session/create.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerCreateSessionDto } from '../../dto/session/create.dto';

@ApiTags('Session')
@Controller('session')
export class CreateSessionController {
  constructor(private readonly createSessionUseCase: CreateSessionUseCase) {}

  @SwaggerCreateSessionDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Post('/:workoutId')
  async handle(@CurrentUser() payload: UserPayload, @Param('workoutId') workoutId: string) {
    const { sub } = payload;

    const session = await this.createSessionUseCase.execute({
      workoutId: new UniqueEntityId(workoutId),
      userId: new UniqueEntityId(sub),
    });

    if (session.isLeft()) {
      const error = session.value;

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
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return {
      message: 'Session created successfully',
    };
  }
}
