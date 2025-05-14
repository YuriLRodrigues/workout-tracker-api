import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllLogsByExerciseIdUseCase } from '@root/domain/application/use-cases/log/find-all-by-exercise-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindAllLogsByExerciseIdDto } from '../../dto/log/find-all-by-exercise-id.dto';
import { PaginationDto } from '../../dto/pagination.dto';
import { ManyLogsByExerciseIdViewModel } from '../../view-model/log/many-logs-by-exercise-id.view-model';

@ApiTags('Log')
@Controller('log')
export class FindAllLogsByExerciseIdController {
  constructor(private readonly findAllLogsByExerciseId: FindAllLogsByExerciseIdUseCase) {}

  @SwaggerFindAllLogsByExerciseIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/many/:exerciseId')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Query() { limit, page }: PaginationDto,
    @Param('exerciseId') exerciseId: string,
  ) {
    const { sub } = payload;

    const logs = await this.findAllLogsByExerciseId.execute({
      userId: new UniqueEntityId(sub),
      exerciseId: new UniqueEntityId(exerciseId),
      limit: limit || 50,
      page: page || 1,
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
      meta: logs.value.meta,
      results: logs.value.data.map(ManyLogsByExerciseIdViewModel.toHttp),
    };
  }
}
