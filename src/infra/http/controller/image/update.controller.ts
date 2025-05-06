import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { UpdateImageUseCase } from '@root/domain/application/use-cases/image/update.use-case';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { ImageTypeError } from 'src/domain/application/errors/image-type-error';
import { UserRole } from 'src/domain/enterprise/types/user';
import { UserPayload } from 'src/infra/auth/auth-user';
import { CurrentUser } from 'src/infra/auth/current-user';
import { Roles } from 'src/infra/auth/roles';

import { SwaggerUpdateImageDto, UpdateImageDto } from '../../dto/image/update.dto';

@ApiTags('Image')
@Controller('image')
export class UpdateImageController {
  constructor(private readonly updateImage: UpdateImageUseCase) {}

  @SwaggerUpdateImageDto()
  @Roles({ roles: [UserRole.MANAGER, UserRole.PERSONAL, UserRole.USER], isAll: false })
  @Post('/update/:id')
  @UseInterceptors(FileInterceptor('file'))
  async handle(
    @UploadedFile() { newImage, type }: UpdateImageDto,
    @Param('id') id: string,
    @CurrentUser() { sub }: UserPayload,
  ) {
    const image = await this.updateImage.execute({
      imageId: new UniqueEntityId(id),
      userId: new UniqueEntityId(sub),
      type,
      newImage,
    });

    if (image.isLeft()) {
      const error = image.value;

      switch (error.constructor) {
        case ImageTypeError:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: error.message,
          });
        case NotAllowedError:
          throw new MethodNotAllowedException({
            statusCode: HttpStatus.UNAUTHORIZED,
            error: error.message,
          });
        case ResourceNotFoundError:
          throw new NotFoundException({
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
      message: 'Image successfully uploaded and updated',
    };
  }
}
