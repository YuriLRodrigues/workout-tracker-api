import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindWorkoutByIdUseCase } from '@root/domain/application/use-cases/workout/find-by-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindWorkoutByIdDto } from '../../dto/workout/find-by-id.dto';
import { WorkoutViewModel } from '../../view-model/workout/workout.view-model';

@ApiTags('Workout')
@Controller('workout')
export class FindWorkoutByIdController {
  constructor(private readonly findWorkoutById: FindWorkoutByIdUseCase) {}

  @SwaggerFindWorkoutByIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/by-id/:id')
  async handle(@CurrentUser() payload: UserPayload, @Param('id') id: string) {
    const { sub } = payload;

    const workout = await this.findWorkoutById.execute({
      userId: new UniqueEntityId(sub),
      id: new UniqueEntityId(id),
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

    return WorkoutViewModel.toHttp(workout.value);
  }
}
