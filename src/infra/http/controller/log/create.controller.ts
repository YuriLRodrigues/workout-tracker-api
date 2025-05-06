import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { CreateLogUseCase } from '@root/domain/application/use-cases/log/create.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { CreateLogBodyDto, SwaggerCreateLogDto } from '../../dto/log/create.dto';

@ApiTags('Log')
@Controller('log')
export class CreateLogController {
  constructor(private readonly createLogUseCase: CreateLogUseCase) {}

  @SwaggerCreateLogDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Post('/:exerciseId')
  async handle(
    @CurrentUser() payload: UserPayload,
    @Param('exerciseId') exerciseId: string,
    @Body() { averageRestTime, maxRepeat, maxSeries, maxWeight, notes }: CreateLogBodyDto,
  ) {
    const { sub } = payload;

    const log = await this.createLogUseCase.execute({
      averageRestTime,
      maxRepeat,
      maxSeries,
      maxWeight,
      notes,
      exerciseId: new UniqueEntityId(exerciseId),
      userId: new UniqueEntityId(sub),
    });

    if (log.isLeft()) {
      const error = log.value;

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

    return {
      message: 'Log created successfully',
    };
  }
}
