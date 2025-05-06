import { Injectable } from '@nestjs/common';
import { ImageType } from '@root/domain/enterprise/types/image';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';
import { ImageEntity } from 'src/domain/enterprise/entities/image.entity';
import { UserRole } from 'src/domain/enterprise/types/user';
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
  userId: UniqueEntityId;
  imageId: UniqueEntityId;
  newImage?: ImageProps;
  type: ImageType;
};

type Output = Either<ResourceNotFoundError | NotAllowedError | ImageTypeError, void>;

@Injectable()
export class UpdateImageUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({ userId, imageId, newImage, type }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    const { isNone: imageNotExists, value: image } = await this.imageRepository.findById({ id: imageId });

    if (userNotExists() || imageNotExists() || (user.role !== UserRole.MANAGER && user.id !== image.userId)) {
      return left(new NotAllowedError());
    }

    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!/^(image\/(png|jpg|jpeg|webp))$/.test(newImage.fileType)) {
      return left(new ImageTypeError(`Unsupported file type: ${newImage.fileType}`));
    }

    if (newImage.fileSize > maxFileSize) {
      return left(new ImageTypeError(`File size exceeds the maximum limit of 5MB: ${newImage.fileSize} bytes`));
    }

    const newImageUploaded = await this.uploader.uploadImage({ image: newImage });

    const blurHash = await generateBlurHash(newImage.body);

    const imageEntity = ImageEntity.create({
      url: newImageUploaded.url,
      blurHash,
      userId: user.id,
      type,
      uploadUniqueName: newImageUploaded.uniqueName,
    });

    await Promise.all([
      this.uploader.deleteImage({ imageKey: image.uploadUniqueName }),
      this.imageRepository.delete({ imageId: image.id }),
      this.imageRepository.create({ image: imageEntity }),
    ]);

    return right(null);
  }
}
