import { BadRequestException, Body, Controller, HttpStatus, NotFoundException, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { UpdateUserPersonalInfoUseCase } from '@root/domain/application/use-cases/user/update-personal-info.use-case';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { UpdatePersonalInfoBodyDto, SwaggerUpdatePersonalInfoDto } from '../../dto/user/update-personal-info.dto';

@ApiTags('User')
@Controller('user')
export class UpdateUserPersonalInfoController {
  constructor(private readonly updateUserPersonalInfo: UpdateUserPersonalInfoUseCase) {}

  @SwaggerUpdatePersonalInfoDto()
  @Roles({ roles: [UserRole.USER, UserRole.MANAGER, UserRole.PERSONAL], isAll: false })
  @Patch('/personal-info')
  async handle(
    @CurrentUser() { sub }: UserPayload,
    @Body() { name, lastName, birthDate, phone, gender }: UpdatePersonalInfoBodyDto,
  ) {
    const user = await this.updateUserPersonalInfo.execute({
      userId: new UniqueEntityId(sub),
      birthDate: birthDate ? new Date(birthDate) : undefined,
      gender,
      lastName,
      name,
      phone,
    });

    if (user.isLeft()) {
      const error = user.value;

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
      message: 'Personal information updated',
    };
  }
}
