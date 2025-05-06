import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllWorkoutsByUserIdUseCase } from '@root/domain/application/use-cases/workout/find-all-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { PaginationDto } from '../../dto/pagination.dto';
import { SwaggerFindAllWorkoutsByUserIdDto } from '../../dto/workout/find-all-by-user-id.dto';
import { WorkoutViewModel } from '../../view-model/workout/workout.view-model';

@ApiTags('Workout')
@Controller('workout')
export class FindAllWorkoutsByUserIdController {
  constructor(private readonly findAllWorkoutsByUserId: FindAllWorkoutsByUserIdUseCase) {}

  @SwaggerFindAllWorkoutsByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/many')
  async handle(@CurrentUser() payload: UserPayload, @Query() { limit, page }: PaginationDto) {
    const { sub } = payload;

    const workouts = await this.findAllWorkoutsByUserId.execute({
      userId: new UniqueEntityId(sub),
      limit: limit || 9,
      page: page || 1,
    });

    if (workouts.isLeft()) {
      const error = workouts.value;

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

    return {
      meta: workouts.value.meta,
      results: workouts.value.data.map(WorkoutViewModel.toHttp),
    };
  }
}
