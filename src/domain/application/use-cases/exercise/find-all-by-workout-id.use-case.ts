import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Exercise } from '@root/domain/enterprise/value-object/exercise';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ExerciseRepository } from '../../repositories/exercise.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, PaginatedResult<Exercise[]>>;

type Input = {
  userId: UniqueEntityId;
  workoutId: UniqueEntityId;
  page: number;
  limit: number;
};

@Injectable()
export class FindAllExercisesByWorkoutIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute({ userId, workoutId, limit, page }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: workouts } = await this.exerciseRepository.findAllByWorkoutId({ userId, workoutId, limit, page });

    return right(workouts);
  }
}
