import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UserRole } from '@root/domain/enterprise/types/user';
import { Exercise } from '@root/domain/enterprise/value-object/exercise';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ExerciseRepository } from '../../repositories/exercise.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, Exercise>;

type Input = {
  userId: UniqueEntityId;
  id: UniqueEntityId;
};

@Injectable()
export class FindExerciseByIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute({ id, userId }: Input): Promise<Output> {
    const { value: user, isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: exercise, isNone: exerciseNotFound } = await this.exerciseRepository.findById({ id });

    if (exerciseNotFound()) return left(new ResourceNotFoundError());

    if (exercise.userId !== userId && user.role === UserRole.USER) return left(new NotAllowedError());

    return right(exercise);
  }
}
