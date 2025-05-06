import { BadRequestException, Controller, Get, HttpStatus, NotFoundException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FindAllByUserIdUseCase } from '@root/domain/application/use-cases/session/find-all-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { PaginationDto } from '../../dto/pagination.dto';
import { SwaggerFindAllByUserIdDto } from '../../dto/session/find-all-by-user-id.dto';
import { HistoryViewModel } from '../../view-model/session/history.view-model';

@ApiTags('Session')
@Controller('session')
export class FindAllByUserIdController {
  constructor(private readonly findAllByUserId: FindAllByUserIdUseCase) {}

  @SwaggerFindAllByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get('/all')
  async handle(@CurrentUser() payload: UserPayload, @Param() { limit, page }: PaginationDto) {
    const { sub } = payload;

    const session = await this.findAllByUserId.execute({
      userId: new UniqueEntityId(sub),
      limit: limit || 9,
      page: page || 1,
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
      meta: session.value.meta,
      results: session.value.data.map(HistoryViewModel.toHttp),
    };
  }
}
