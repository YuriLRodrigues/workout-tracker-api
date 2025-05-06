import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { SessionRepository } from '../../repositories/session.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, { timeDiffSeconds: number; totalThisWeekSeconds: number }>;

type Input = {
  userId: UniqueEntityId;
};

@Injectable()
export class FindAverageTimeByWeekUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const {
      value: { timeDiffSeconds, totalThisWeekSeconds },
    } = await this.sessionRepository.findAverageTimeByWeek({ userId });

    return right({ timeDiffSeconds, totalThisWeekSeconds });
  }
}
