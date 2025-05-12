import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindWorkoutsHistoryByUserIdUseCase } from '@root/domain/application/use-cases/workout/find-workouts-history-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { PaginationDto } from '../../dto/pagination.dto';
import {
  FindWorkoutsHistoryByUserIdQueryDto,
  SwaggerFindWorkoutsHistoryByUserIdDto,
} from '../../dto/workout/find-history-by-user-id.dto';
import { HistoryViewModel } from '../../view-model/session/history.view-model';

@ApiTags('Workout')
@Controller('workout')
export class FindWorkoutsHistoryByUserIdController {
  constructor(private readonly findWorkoutsHistoryByUserId: FindWorkoutsHistoryByUserIdUseCase) {}

  @SwaggerFindWorkoutsHistoryByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/history')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Query() { limit, page }: PaginationDto,
    @Query() { query }: FindWorkoutsHistoryByUserIdQueryDto,
  ) {
    const hasInsertQuery = query !== 'undefined';
    const { sub } = payload;

    const history = await this.findWorkoutsHistoryByUserId.execute({
      userId: new UniqueEntityId(sub),
      limit: limit || 9,
      page: page || 1,
      query: hasInsertQuery ? query : undefined,
    });

    if (history.isLeft()) {
      const error = history.value;

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
      meta: history.value.meta,
      results: history.value.data.map(HistoryViewModel.toHttp),
    };
  }
}
