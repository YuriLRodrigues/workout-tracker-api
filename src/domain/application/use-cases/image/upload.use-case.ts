import { Injectable } from '@nestjs/common';
import { ImageType } from '@root/domain/enterprise/types/image';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { Either, left, right } from 'src/core/logic/Either';
import { ImageEntity } from 'src/domain/enterprise/entities/image.entity';
import { SwaggerImageTypeErrorDto } from 'src/infra/http/dto/swagger.dto';
import { generateBlurHash } from 'src/utils/blur-hash';

import { ImageTypeError } from '../../errors/image-type-error';
import { ImageRepository } from '../../repositories/image.repository';
import { Uploader } from '../../repositories/uploader.repository';
import { UserRepository } from '../../repositories/user.repository';

type ImageProps = {
  fileName: string;
  fileType: string;
  fileSize: number;
  body: Buffer;
};

type Input = {
  image: ImageProps;
  type: ImageType;
  userId: UniqueEntityId;
};

type Output = Either<NotAllowedError | SwaggerImageTypeErrorDto, ImageEntity>;

@Injectable()
export class UploadImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ image, type, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotExists()) {
      return left(new NotAllowedError());
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!/^(image\/(png|jpg|jpeg|webp))$/.test(image.fileType)) {
      return left(new ImageTypeError(`Unsupported file type: ${image.fileType}`));
    }

    if (image.fileSize > maxFileSize) {
      return left(new ImageTypeError(`File size exceeds the maximum limit of 5MB: ${image.fileSize} bytes`));
    }

    const { value: avatar, isSome: avatarAlreadyExists } = await this.imageRepository.findUserAvatar({ userId });

    const blurHash = await generateBlurHash(image.body);
    const imageUploaded = await this.uploader.uploadImage({ image });

    const imageEntity = ImageEntity.create({
      url: imageUploaded.url,
      blurHash,
      type,
      userId: user.id,
      uploadUniqueName: imageUploaded.uniqueName,
    });

    Promise.all([
      this.imageRepository.create({ image: imageEntity }),
      avatarAlreadyExists() && this.imageRepository.delete({ imageId: avatar.id }),
      avatarAlreadyExists() && this.uploader.deleteImage({ imageKey: avatar.uploadUniqueName }),
    ]);

    return right(imageEntity);
  }
}
