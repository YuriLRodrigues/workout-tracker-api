import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRole } from '@root/domain/enterprise/types/user';
import { Workout } from '@root/domain/enterprise/value-object/workout';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, Workout>;

type Input = {
  userId: UniqueEntityId;
  id: UniqueEntityId;
};

@Injectable()
export class FindWorkoutByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ id, userId }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: workout, isNone: workoutNotFound } = await this.workoutRepository.findById({ id });

    if (workoutNotFound()) return left(new ResourceNotFoundError());

    if (workout.userId.toValue() !== userId.toValue() && user.role !== UserRole.MANAGER)
      return left(new NotAllowedError());

    return right(workout);
  }
}
