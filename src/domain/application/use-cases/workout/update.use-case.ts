import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { WorkoutEntity } from '@root/domain/enterprise/entities/workout.entity';
import { UserRole } from '@root/domain/enterprise/types/user';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { UserRepository } from '../../repositories/user.repository';
import { WorkoutRepository } from '../../repositories/workout.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  name: string;
  description: string;
  icon: string;
  color: string;
  userId: UniqueEntityId;
  workoutId: UniqueEntityId;
};

@Injectable()
export class UpdateWorkoutUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly workoutRepository: WorkoutRepository,
  ) {}

  async execute({ description, icon, color, name, userId, workoutId }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { isNone: workoutNotFound, value: workout } = await this.workoutRepository.findById({ id: workoutId });

    if (workoutNotFound()) return left(new ResourceNotFoundError());

    if (workout.userId.toValue() !== userId.toValue() && user.role !== UserRole.MANAGER)
      return left(new NotAllowedError());

    const workoutEntity = WorkoutEntity.create(
      {
        color: workout.color,
        description: workout.description,
        icon: workout.icon,
        name: workout.name,
        userId: workout.userId,
      },
      workout.id,
    );

    const updatedWorkout = workoutEntity.update({
      color,
      description,
      icon,
      name,
    });

    await this.workoutRepository.update({ workout: updatedWorkout });

    return right(null);
  }
}
