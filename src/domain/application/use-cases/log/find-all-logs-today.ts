import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { LogRepository } from '../../repositories/log.repository';
import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, { totalCompleted: number; totalExercises: number }>;

type Input = {
  workoutId: UniqueEntityId;
  userId: UniqueEntityId;
};

@Injectable()
export class FindAllLogsTodayUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async execute({ userId, workoutId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: workoutNotFound } = await this.workoutRepository.findById({ id: workoutId });

    if (workoutNotFound()) return left(new ResourceNotFoundError());

    const { value: logs } = await this.logRepository.findAllLogsToday({ userId, workoutId });

    return right(logs);
  }
}
