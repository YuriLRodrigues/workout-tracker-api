import {
  BadRequestException,
  Controller,
  HttpStatus,
  MethodNotAllowedException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ImageTypeError } from '@root/domain/application/errors/image-type-error';
import { UploadImageUseCase } from '@root/domain/application/use-cases/image/upload.use-case';
import { ImageType } from '@root/domain/enterprise/types/image';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UserPayload } from '@root/infra/auth/auth-user';
import { CurrentUser } from '@root/infra/auth/current-user';
import { Roles } from '@root/infra/auth/roles';

import { ApiFile } from '../../decorators/file.decorator';
import { SwaggerUploadImageDto } from '../../dto/image/upload.dto';
import { UploadImageViewModel } from '../../view-model/image/upload-image.view-model';

@ApiTags('Image')
@Controller('image')
export class UploadImageController {
  constructor(private readonly uploadImage: UploadImageUseCase) {}

  @SwaggerUploadImageDto()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiFile()
  @Roles({ roles: [UserRole.MANAGER, UserRole.USER, UserRole.PERSONAL], isAll: false })
  @Post('/upload/:type')
  async handle(
    @CurrentUser() payload: UserPayload,
    @UploadedFile('file') file: Express.Multer.File,
    @Param('type') type: ImageType,
  ) {
    const { sub } = payload;

    const img = await this.uploadImage.execute({
      image: { fileName: file.originalname, fileSize: file.size, fileType: file.mimetype, body: file.buffer },
      userId: new UniqueEntityId(sub),
      type,
    });

    if (img.isLeft()) {
      const error = img.value;
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
        default:
          throw new BadRequestException({
            statusCode: HttpStatus.BAD_REQUEST,
            error: 'Internal API error',
          });
      }
    }

    return UploadImageViewModel.toHttp(img.value);
  }
}
