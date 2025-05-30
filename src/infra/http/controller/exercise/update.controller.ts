import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UpdateExerciseUseCase } from '@root/domain/application/use-cases/exercise/update.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { UpdateExerciseBodyDto, SwaggerUpdateExerciseDto } from '../../dto/exercise/update.dto';

@ApiTags('Exercise')
@Controller('exercise')
export class UpdateExerciseController {
  constructor(private readonly updateExerciseUseCase: UpdateExerciseUseCase) {}

  @SwaggerUpdateExerciseDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Patch('/:exerciseId')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Param('exerciseId') exerciseId: string,
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
    }: UpdateExerciseBodyDto,
  ) {
    const { sub } = payload;

    const exercise = await this.updateExerciseUseCase.execute({
      description,
      executionType,
      muscleType,
      targetRepetitions,
      targetResTime,
      targetSets,
      videoReference,
      name,
      exerciseId: new UniqueEntityId(exerciseId),
      userId: new UniqueEntityId(sub),
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
      message: 'Exercise updated successfully',
    };
  }
}
