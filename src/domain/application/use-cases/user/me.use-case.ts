import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';
import { Me } from 'src/domain/enterprise/value-object/me';

import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, Me>;

type Input = {
  id: UniqueEntityId;
};

@Injectable()
export class MeUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
  ) {}

  async execute({ id }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: avatar } = await this.imageRepository.findUserAvatar({
      userId: user.id,
    });

    const me = Me.create({
      id: user.id,
      avatar: avatar?.url,
      blurHash: avatar?.blurHash,
      email: user.email,
      name: user.name,
      lastName: user.lastName,
      birthDate: user.birthDate,
      gender: user.gender,
      phone: user.phone,
      createdAt: user.createdAt,
      role: user.role,
    });

    return right(me);
  }
}
