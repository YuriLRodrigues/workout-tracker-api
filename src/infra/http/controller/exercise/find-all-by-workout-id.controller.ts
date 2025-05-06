import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllExercisesByWorkoutIdUseCase } from '@root/domain/application/use-cases/exercise/find-all-by-workout-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindAllExercisesByWorkoutIdDto } from '../../dto/exercise/find-all-by-user-id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { ExerciseViewModel } from '../../view-model/exercise/exercise.view-model';

@ApiTags('Exercise')
@Controller('exercise')
export class FindAllExercisesByWorkoutIdController {
  constructor(private readonly findAllExercisesByWorkoutId: FindAllExercisesByWorkoutIdUseCase) {}

  @SwaggerFindAllExercisesByWorkoutIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/many/:workoutId')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Query() { limit, page }: PaginationDto,
    @Param('workoutId') workoutId: string,
  ) {
    const { sub } = payload;

    const exercises = await this.findAllExercisesByWorkoutId.execute({
      userId: new UniqueEntityId(sub),
      workoutId: new UniqueEntityId(workoutId),
      limit: limit || 50,
      page: page || 1,
    });

    if (exercises.isLeft()) {
      const error = exercises.value;

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
      meta: exercises.value.meta,
      results: exercises.value.data.map(ExerciseViewModel.toHttp),
    };
  }
}
