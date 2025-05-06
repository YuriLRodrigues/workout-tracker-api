import { BadRequestException, Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindTotalSeriesByWeekUseCase } from '@root/domain/application/use-cases/session/find-total-series-by-week.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindTotalSeriesByWeekDto } from '../../dto/session/find-total-series-by-week.dto';

@ApiTags('Session')
@Controller('session')
export class FindTotalSeriesByWeekController {
  constructor(private readonly findTodayByWorkoutId: FindTotalSeriesByWeekUseCase) {}

  @SwaggerFindTotalSeriesByWeekDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/total-series-by-week')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const session = await this.findTodayByWorkoutId.execute({
      userId: new UniqueEntityId(sub),
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

    return {
      seriesDiff: session.value.seriesDiff,
      thisWeekTotal: session.value.thisWeekTotal,
    };
  }
}
