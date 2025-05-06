import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteWorkoutUseCase } from '@root/domain/application/use-cases/workout/delete.use-case';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerDeleteWorkoutDto } from '../../dto/workout/delete.dto';

@ApiTags('Workout')
@Controller('workout')
export class DeleteWorkoutController {
  constructor(private readonly deleteWorkoutUseCase: DeleteWorkoutUseCase) {}

  @SwaggerDeleteWorkoutDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Delete('/:id')
  async handle(@CurrentUser() { sub }: UserPayload, @Param('id') id: string) {
    const workout = await this.deleteWorkoutUseCase.execute({
      id: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
    });

    if (workout.isLeft()) {
      const error = workout.value;

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
      message: 'Workout successfully deleted',
    };
  }
}
