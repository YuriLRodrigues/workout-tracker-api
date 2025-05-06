import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRole } from 'src/domain/enterprise/types/user';

import { ImageRepository } from '../../repositories/image.repository';
import { Uploader } from '../../repositories/uploader.repository';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  id: UniqueEntityId;
  userId: UniqueEntityId;
};

type Output = Either<NotAllowedError | ResourceNotFoundError, void>;

@Injectable()
export class DeleteImageUseCase {
  constructor(
    private readonly imageRepository: ImageRepository,
    private readonly userRepository: UserRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({ id, userId }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findById({
      id: userId,
    });

    const { isNone: imageNotExists, value: image } = await this.imageRepository.findById({ id });

    if (imageNotExists()) {
      return left(new ResourceNotFoundError());
    }

    if (userNotExists() || (user.role !== UserRole.MANAGER && user.id !== image.userId)) {
      return left(new NotAllowedError());
    }

    await Promise.all([
      this.imageRepository.delete({ imageId: image.id }),
      this.uploader.deleteImage({ imageKey: image.uploadUniqueName }),
    ]);

    return right(null);
  }
}
