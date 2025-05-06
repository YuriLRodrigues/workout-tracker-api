import {
  BadRequestException,
  Controller,
  Delete,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { DeleteUserUseCase } from '@root/domain/application/use-cases/user/delete.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerDeleteUserDto } from '../../dto/user/delete.dto';

@ApiTags('User')
@Controller('user')
export class DeleteUserController {
  constructor(private readonly deleteUserUseCase: DeleteUserUseCase) {}

  @SwaggerDeleteUserDto()
  @Roles({ roles: [UserRole.MANAGER] })
  @Delete('/manager/:id')
  async handle(@CurrentUser() { sub }: UserPayload, @Param('id') id: string) {
    const user = await this.deleteUserUseCase.execute({
      currentUserId: new UniqueEntityId(sub),
      userId: new UniqueEntityId(id),
    });

    if (user.isLeft()) {
      const error = user.value;

      switch (error.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException({
            statusCode: HttpStatus.NOT_FOUND,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
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
      message: 'User successfully deleted',
    };
  }
}
