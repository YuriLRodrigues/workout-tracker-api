import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { SessionRepository } from '../../repositories/session.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, { thisWeekCount: number; workoutDiffCount: number }>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindAverageWorkoutByWeekUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const {
      value: { thisWeekCount, workoutDiffCount },
    } = await this.sessionRepository.findAverageWorkoutByWeek({ userId });

    return right({ thisWeekCount, workoutDiffCount });
  }
}
