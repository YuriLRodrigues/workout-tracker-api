import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { History } from '@root/domain/enterprise/value-object/history';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, PaginatedResult<History[]>>;

type Input = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
  query?: string;
};

@Injectable()
export class FindWorkoutsHistoryByUserIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ userId, limit, page, query }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: workouts } = await this.workoutRepository.findWorkoutsHistoryByUserId({
      userId,
      limit,
      page,
      query,
    });

    return right(workouts);
  }
}
