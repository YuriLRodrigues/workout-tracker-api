import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Patch,
  Body,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdateSessionUseCase } from '@root/domain/application/use-cases/session/update.use-case';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerUpdateSessionDto, UpdateSessionBodyDto } from '../../dto/session/update.dto';

@ApiTags('Session')
@Controller('session')
export class UpdateSessionController {
  constructor(private readonly updateSessionUseCase: UpdateSessionUseCase) {}

  @SwaggerUpdateSessionDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Patch('/:sessionId')
  async handle(
    @CurrentUser() { sub }: UserPayload,
    @Param('sessionId') sessionId: string,
    @Body() { workoutId }: UpdateSessionBodyDto,
  ) {
    const session = await this.updateSessionUseCase.execute({
      userId: new UniqueEntityId(sub),
      sessionId: new UniqueEntityId(sessionId),
      workoutId: new UniqueEntityId(workoutId),
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
            statusCode: HttpStatus.UNAUTHORIZED,
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
      message: 'Session successfully updated',
    };
  }
}
