import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreatePhysicalUseCase } from '@root/domain/application/use-cases/physical/create.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { CreatePhysicalBodyDto, SwaggerCreatePhysicalDto } from '../../dto/physical/create.dto';

@ApiTags('Physical')
@Controller('physical')
export class CreatePhysicalController {
  constructor(private readonly createPhysicalUseCase: CreatePhysicalUseCase) {}

  @SwaggerCreatePhysicalDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Post()
  async handle(
    @CurrentUser() payload: UserPayload,
    @Body() { age, goal, height, weight, bodyFat, muscleMass }: CreatePhysicalBodyDto,
  ) {
    const { sub } = payload;

    const physical = await this.createPhysicalUseCase.execute({
      age,
      goal,
      height,
      weight,
      bodyFat,
      muscleMass,
      userId: new UniqueEntityId(sub),
    });
    if (physical.isLeft()) {
      const error = physical.value;

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
      message: 'Physical created successfully',
    };
  }
}
