import { BadRequestException, Controller, Get, HttpStatus, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindFrequencyByWeekAndUserIdUseCase } from '@root/domain/application/use-cases/session/find-frequency-by-week-and-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindFrequencyByWeekAndUserIdDto } from '../../dto/session/find-frequency-by-week-and-user-id.dto';

@ApiTags('Session')
@Controller('session')
export class FindFrequencyByWeekAndUserIdController {
  constructor(private readonly findFrequencyByWeekAndUserId: FindFrequencyByWeekAndUserIdUseCase) {}

  @SwaggerFindFrequencyByWeekAndUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/frequency')
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const session = await this.findFrequencyByWeekAndUserId.execute({
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
      frequency: session.value.frequency,
    };
  }
}
