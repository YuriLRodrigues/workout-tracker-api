import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { FindPhysicalStatsByUserIdUseCase } from '@root/domain/application/use-cases/physical/find-physical-stats-by-user-id.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerFindPhysicalStatsByUserIdDto } from '../../dto/physical/find-stats-by-user-id.dto';
import { PhysicalViewModel } from '../../view-model/physical/physical.view-model';

@ApiTags('Physical')
@Controller('physical')
export class FindPhysicalStatsByUserIdController {
  constructor(private readonly findPhysicalStatsByUserId: FindPhysicalStatsByUserIdUseCase) {}

  @SwaggerFindPhysicalStatsByUserIdDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Get()
  async handle(@CurrentUser() payload: UserPayload) {
    const { sub } = payload;

    const physicalStats = await this.findPhysicalStatsByUserId.execute({
      userId: new UniqueEntityId(sub),
    });

    if (physicalStats.isLeft()) {
      const error = physicalStats.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.METHOD_NOT_ALLOWED,
            error: error.message,
          });
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return { data: physicalStats ? PhysicalViewModel.toHttp(physicalStats.value) : null };
  }
}
