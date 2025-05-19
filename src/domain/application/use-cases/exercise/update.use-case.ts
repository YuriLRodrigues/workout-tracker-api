import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ExerciseEntity } from '@root/domain/enterprise/entities/exercise.entity';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ExerciseRepository } from '../../repositories/exercise.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  name?: string;
  description?: string;
  executionType?: ExecutionType;
  muscleType?: MuscleType;
  targetRepetitions?: number;
  targetResTime?: number;
  targetSets?: number;
  videoReference?: string;
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
};

@Injectable()
export class UpdateExerciseUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {}

  async execute({
    description,
    executionType,
    muscleType,
    targetRepetitions,
    targetResTime,
    targetSets,
    videoReference,
    exerciseId,
    name,
    userId,
  }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: exerciseNotFound, value: exercise } = await this.exerciseRepository.findById({ id: exerciseId });

    if (exerciseNotFound()) return left(new ResourceNotFoundError());

    if (exercise.userId.toValue() !== userId.toValue() && user.role !== UserRole.MANAGER)
      return left(new NotAllowedError());

    const exerciseEntity = ExerciseEntity.create(
      {
        name,
        description,
        executionType,
        muscleType,
        targetRepetitions,
        targetResTime,
        targetSets,
        videoReference,
        workoutId: exercise.workoutId,
        userId,
      },
      exercise.id,
    );

    const updatedExercise = exerciseEntity.update({
      description,
      executionType,
      muscleType,
      targetRepetitions,
      targetResTime,
      targetSets,
      videoReference,
      name,
    });

    await this.exerciseRepository.update({ exercise: updatedExercise });

    return right(null);
  }
}
