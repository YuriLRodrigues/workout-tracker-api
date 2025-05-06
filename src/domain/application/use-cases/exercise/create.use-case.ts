import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { ExerciseEntity } from '@root/domain/enterprise/entities/exercise.entity';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ExerciseRepository } from '../../repositories/exercise.repository';
import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  name: string;
  description: string;
  executionType: ExecutionType;
  muscleType: MuscleType;
  targetRepetitions: number;
  targetResTime: number;
  targetSets: number;
  videoReference?: string;
  workoutId: UniqueEntityId;
  userId: UniqueEntityId;
  bannerId?: UniqueEntityId;
};

@Injectable()
export class CreateExerciseUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
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
    workoutId,
    name,
    userId,
    bannerId,
  }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const exercise = ExerciseEntity.create({
      name,
      description,
      executionType,
      muscleType,
      targetRepetitions,
      targetResTime,
      targetSets,
      videoReference,
      workoutId,
      userId,
    });

    if (bannerId) {
      const { value: banner, isNone: bannerNotFound } = await this.imageRepository.findById({
        id: bannerId,
      });

      if (bannerNotFound()) return left(new ResourceNotFoundError());

      banner.exerciseId = exercise.id;
      exercise.bannerId = banner.id;

      await this.imageRepository.update({ image: banner });
    }

    await this.exerciseRepository.create({ exercise });

    return right(null);
  }
}
