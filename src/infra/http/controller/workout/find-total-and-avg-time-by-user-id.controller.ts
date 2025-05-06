import { BadRequestException, Controller, Get, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindTotalAndAvgTimeByUserIdUseCase } from '@root/domain/application/use-cases/workout/find-total-and-avg-time-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindTotalAndAvgTimeByUserIdDto } from '../../dto/workout/find-total-and-avg-time-by-user-id.dto';

@ApiTags('Workout')
@Controller('workout')
export class FindTotalAndAvgTimeByUserIdController {
  constructor(private readonly findTotalAndAvgTimeByUserIdUseCase: FindTotalAndAvgTimeByUserIdUseCase) {}

  @SwaggerFindTotalAndAvgTimeByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @HttpCode(200)
  @Get('/metrics/time')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const time = await this.findTotalAndAvgTimeByUserIdUseCase.execute({
      userId: new UniqueEntityId(sub),
    });

    if (time.isLeft()) {
      const error = time.value;

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
      avgSeconds: time.value.avgSeconds,
      totalSeconds: time.value.totalSeconds,
    };
  }
}
