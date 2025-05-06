import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ExerciseRepository } from '../../repositories/exercise.repository';
import { LogRepository } from '../../repositories/log.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, { id: string } | null>;

type Input = {
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
};

@Injectable()
export class FindLogTodayByExerciseIdUseCase {
  constructor(
    private readonly exerciseRepository: ExerciseRepository,
    private readonly userRepository: UserRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async execute({ exerciseId, userId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: exerciseNotFound } = await this.exerciseRepository.findById({ id: exerciseId });
    if (exerciseNotFound()) return left(new ResourceNotFoundError());

    const { value: log } = await this.logRepository.findLogTodayByExerciseId({ exerciseId });

    return right(log ?? null);
  }
}
