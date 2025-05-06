import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Workout } from '@root/domain/enterprise/value-object/workout';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, PaginatedResult<Workout[]>>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

@Injectable()
export class FindAllWorkoutsByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ userId, limit, page }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: workouts } = await this.workoutRepository.findAllByUserId({ userId, limit, page });

    return right(workouts);
  }
}
