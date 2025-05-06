import { BadRequestException, Controller, Get, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindTotalCountByUserIdUseCase } from '@root/domain/application/use-cases/workout/find-total-count-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindTotalWorkoutsCountByUserIdDto } from '../../dto/workout/find-total-count-by-user-id.dto';

@ApiTags('Workout')
@Controller('workout')
export class FindTotalWorkoutsCountByUserIdController {
  constructor(private readonly findTotalCountByUserIdUseCase: FindTotalCountByUserIdUseCase) {}

  @SwaggerFindTotalWorkoutsCountByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @HttpCode(200)
  @Get('/metrics/count')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const count = await this.findTotalCountByUserIdUseCase.execute({
      userId: new UniqueEntityId(sub),
    });

    if (count.isLeft()) {
      const error = count.value;

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
      totalCount: count.value.totalCount,
      since: count.value.since,
    };
  }
}
