import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { LogRepository } from '../../repositories/log.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  userId: UniqueEntityId;
  id: UniqueEntityId;
};

@Injectable()
export class DeleteLogUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async execute({ id, userId }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: log, isNone: logNotFound } = await this.logRepository.findById({ id });

    if (logNotFound()) return left(new ResourceNotFoundError());

    if (log.userId.toValue() !== userId.toValue() && user.role !== UserRole.MANAGER) return left(new NotAllowedError());

    await this.logRepository.delete({ logId: id });

    return right(null);
  }
}
