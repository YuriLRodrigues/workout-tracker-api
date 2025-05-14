import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UpdatePhysicalUseCase } from '@root/domain/application/use-cases/physical/update.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { UpdatePhysicalBodyDto, SwaggerUpdatePhysicalDto } from '../../dto/physical/update.dto';

@ApiTags('Physical')
@Controller('physical')
export class UpdatePhysicalController {
  constructor(private readonly updatePhysicalUseCase: UpdatePhysicalUseCase) {}

  @SwaggerUpdatePhysicalDto()
  @Roles({
    roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL],
    isAll: false,
  })
  @Patch()
  async handle(
    @CurrentUser() payload: UserPayload,
    @Body() { age, goal, height, weight, bodyFat, muscleMass }: UpdatePhysicalBodyDto,
  ) {
    const { sub } = payload;

    const physical = await this.updatePhysicalUseCase.execute({
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
      message: 'Physical updated successfully',
    };
  }
}
