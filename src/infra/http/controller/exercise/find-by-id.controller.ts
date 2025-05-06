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
import { FindExerciseByIdUseCase } from '@root/domain/application/use-cases/exercise/find-by-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindExerciseByIdDto } from '../../dto/exercise/find-by-id.dto';
import { ExerciseViewModel } from '../../view-model/exercise/exercise.view-model';

@ApiTags('Exercise')
@Controller('exercise')
export class FindExerciseByIdController {
  constructor(private readonly findExerciseById: FindExerciseByIdUseCase) {}

  @SwaggerFindExerciseByIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/:id')
  async handle(@CurrentUser() payload: UserPayload, @Param('id') id: string) {
    const { sub } = payload;

    const exercise = await this.findExerciseById.execute({
      userId: new UniqueEntityId(sub),
      id: new UniqueEntityId(id),
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

    return ExerciseViewModel.toHttp(exercise.value);
  }
}
