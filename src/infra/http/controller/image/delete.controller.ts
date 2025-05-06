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
import { DeleteImageUseCase } from '@root/domain/application/use-cases/image/delete.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerDeleteImageDto } from '../../dto/image/delete.dto';

@ApiTags('Image')
@Controller('image')
export class DeleteImageController {
  constructor(private readonly deleteImage: DeleteImageUseCase) {}

  @SwaggerDeleteImageDto()
  @Roles({ roles: [UserRole.MANAGER, UserRole.USER, UserRole.PERSONAL] })
  @Delete('/:id')
  async handle(@Param('id') id: string, @CurrentUser() { sub }: UserPayload) {
    const image = await this.deleteImage.execute({ id: new UniqueEntityId(id), userId: new UniqueEntityId(sub) });

    if (image.isLeft()) {
      const error = image.value;

      switch (error.constructor) {
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
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
      message: 'Image deleted successfully',
    };
  }
}
