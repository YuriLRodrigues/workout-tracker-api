import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';
import { UserRole } from 'src/domain/enterprise/types/user';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  currentUserId: UniqueEntityId;
  userId: UniqueEntityId;
};

@Injectable()
export class DeleteUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ currentUserId, userId }: Input): Promise<Output> {
    const { isNone: adminUserNotFound, value: adminUser } = await this.userRepository.findById({
      id: currentUserId,
    });

    if (adminUserNotFound() || adminUser?.role !== UserRole.MANAGER) {
      return left(new NotAllowedError());
    }

    const { isNone: userNotFound } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    await this.userRepository.delete({ userId });

    return right(null);
  }
}
