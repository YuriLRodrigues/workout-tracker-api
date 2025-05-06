import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { WorkoutEntity } from '@root/domain/enterprise/entities/workout.entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ImageRepository } from '../../repositories/image.repository';
import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  name: string;
  description: string;
  icon: string;
  color: string;
  userId: UniqueEntityId;
  bannerId?: UniqueEntityId;
};

@Injectable()
export class CreateWorkoutUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ description, icon, color, name, userId, bannerId }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const workout = WorkoutEntity.create({
      name,
      description,
      icon,
      color,
      userId,
    });

    if (bannerId) {
      const { value: banner, isNone: bannerNotFound } = await this.imageRepository.findById({
        id: bannerId,
      });
      if (bannerNotFound()) return left(new ResourceNotFoundError());

      banner.workoutId = workout.id;

      await this.imageRepository.update({ image: banner });
    }

    await this.workoutRepository.create({ workout });

    return right(null);
  }
}
