import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllLogsTodayUseCase } from '@root/domain/application/use-cases/log/find-all-logs-today';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindAllLogsTodayDto } from '../../dto/log/find-all-today.dto';

@ApiTags('Log')
@Controller('log')
export class FindAllLogsTodayController {
  constructor(private readonly findAllLogsToday: FindAllLogsTodayUseCase) {}

  @SwaggerFindAllLogsTodayDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('metrics/:workoutId')
  async handle(@CurrentUser() payload: UserPayload, @Param('workoutId') workoutId: string) {
    const { sub } = payload;

    const logs = await this.findAllLogsToday.execute({
      userId: new UniqueEntityId(sub),
      workoutId: new UniqueEntityId(workoutId),
    });

    if (logs.isLeft()) {
      const error = logs.value;

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
      totalCompleted: logs.value.totalCompleted,
      totalExercises: logs.value.totalExercises,
    };
  }
}
