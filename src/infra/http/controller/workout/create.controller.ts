import {
  BadRequestException,
  Body,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { CreateWorkoutUseCase } from '@root/domain/application/use-cases/workout/create.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { CreateWorkoutBodyDto, SwaggerCreateWorkoutDto } from '../../dto/workout/create.dto';

@ApiTags('Workout')
@Controller('workout')
export class CreateWorkoutController {
  constructor(private readonly createWorkoutUseCase: CreateWorkoutUseCase) {}

  @SwaggerCreateWorkoutDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Post()
  async handle(
    @CurrentUser() payload: UserPayload,
    @Body() { description, icon, name, color, bannerId }: CreateWorkoutBodyDto,
  ) {
    const { sub } = payload;

    const workout = await this.createWorkoutUseCase.execute({
      description,
      icon,
      name,
      color,
      userId: new UniqueEntityId(sub),
      bannerId: bannerId ? new UniqueEntityId(bannerId) : undefined,
    });

    if (workout.isLeft()) {
      const error = workout.value;

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
      message: 'Workout created successfully',
    };
  }
}
