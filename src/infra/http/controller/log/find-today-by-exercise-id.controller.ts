import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindLogTodayByExerciseIdUseCase } from '@root/domain/application/use-cases/log/find-today-by-exercise-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindLogTodayByExerciseIdDto } from '../../dto/log/find-all-today-by-exercise-id.dto';

@ApiTags('Log')
@Controller('log')
export class FindLogTodayByExerciseIdUseCaseController {
  constructor(private readonly findLogTodayByExerciseId: FindLogTodayByExerciseIdUseCase) {}

  @SwaggerFindLogTodayByExerciseIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/exercise/:exerciseId')
  async handle(@CurrentUser() payload: UserPayload, @Param('exerciseId') exerciseId: string) {
    const { sub } = payload;

    const log = await this.findLogTodayByExerciseId.execute({
      userId: new UniqueEntityId(sub),
      exerciseId: new UniqueEntityId(exerciseId),
    });

    if (log.isLeft()) {
      const error = log.value;

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

    return log.value;
  }
}
