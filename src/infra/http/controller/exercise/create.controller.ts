import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { CreateExerciseUseCase } from '@root/domain/application/use-cases/exercise/create.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { CreateExerciseBodyDto, SwaggerCreateExerciseDto } from '../../dto/exercise/create.dto';

@ApiTags('Exercise')
@Controller('exercise')
export class CreateExerciseController {
  constructor(private readonly createExerciseUseCase: CreateExerciseUseCase) {}

  @SwaggerCreateExerciseDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Post('/:workoutId')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Param('workoutId') workoutId: string,
    @Body()
    {
      name,
      description,
      executionType,
      muscleType,
      targetRepetitions,
      targetResTime,
      targetSets,
      videoReference,
      bannerId,
    }: CreateExerciseBodyDto,
  ) {
    const { sub } = payload;

    const exercise = await this.createExerciseUseCase.execute({
      description,
      executionType,
      muscleType,
      targetRepetitions,
      targetResTime,
      targetSets,
      videoReference,
      name,
      workoutId: new UniqueEntityId(workoutId),
      userId: new UniqueEntityId(sub),
      bannerId: bannerId ? new UniqueEntityId(bannerId) : undefined,
    });

    if (exercise.isLeft()) {
      const error = exercise.value;

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
      message: 'Exercise created successfully',
    };
  }
}
