import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { SessionRepository } from '../../repositories/session.repository';
import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, { id: string } | null>;

type Input = {
  userId: UniqueEntityId;
  workoutId: UniqueEntityId;
};

@Injectable()
export class FindSessionTodayByWorkoutIdAndUserIdUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, workoutId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: workoutNotFound } = await this.workoutRepository.findById({ id: workoutId });

    if (workoutNotFound()) return left(new ResourceNotFoundError());

    const { value: session } = await this.sessionRepository.findTodayByWorkoutIdAndUserId({ userId, workoutId });

    return right(session ?? null);
  }
}
