import { Injectable } from '@nestjs/common';
import { PhysicalEntity } from '@root/domain/enterprise/entities/physical.entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { PhysicalRepository } from '../../repositories/physical.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, null | PhysicalEntity>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindPhysicalStatsByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly physicalRepository: PhysicalRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: physical, isNone: PhysicalStatsNotFound } = await this.physicalRepository.findUserPhysicalStats({
      userId,
    });

    if (PhysicalStatsNotFound()) return right(null);

    return right(physical);
  }
}
