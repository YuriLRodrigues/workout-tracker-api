import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindSessionTodayByWorkoutIdUseCase } from '@root/domain/application/use-cases/session/find-today-by-workout-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindTodayWorkoutSessionDto } from '../../dto/session/find-today-by-workout-id.dto';
import { SessionViewModel } from '../../view-model/session/session.view-model';

@ApiTags('Session')
@Controller('session')
export class FindSessionTodayByWorkoutIdController {
  constructor(private readonly findTodayByWorkoutId: FindSessionTodayByWorkoutIdUseCase) {}

  @SwaggerFindTodayWorkoutSessionDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/workout/:workoutId')
  async handle(@CurrentUser() payload: UserPayload, @Param('workoutId') workoutId: string) {
    const { sub } = payload;

    const session = await this.findTodayByWorkoutId.execute({
      userId: new UniqueEntityId(sub),
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
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return { data: session.value ? SessionViewModel.toHttp(session.value) : null };
  }
}
