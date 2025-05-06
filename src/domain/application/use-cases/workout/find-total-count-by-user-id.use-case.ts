import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, { totalCount: number; since: Date }>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindTotalCountByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const {
      value: { totalCount, since },
    } = await this.workoutRepository.findTotalCountByUserId({ userId });

    return right({ totalCount, since });
  }
}
