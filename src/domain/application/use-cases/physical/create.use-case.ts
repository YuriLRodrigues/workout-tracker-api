import { Injectable } from '@nestjs/common';
import { PhysicalEntity } from '@root/domain/enterprise/entities/physical.entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { PhysicalRepository } from '../../repositories/physical.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, void>;

type Input = {
  height: number;
  weight: number;
  age: number;
  bodyFat?: number;
  muscleMass?: number;
  goal: string;
  userId: UniqueEntityId;
};

@Injectable()
export class CreatePhysicalUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly physicalRepository: PhysicalRepository,
  ) {}

  async execute({ age, goal, height, userId, weight, bodyFat, muscleMass }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const physical = PhysicalEntity.create({
      age,
      goal,
      height,
      userId,
      weight,
      bodyFat,
      muscleMass,
    });

    await this.physicalRepository.create({ physical });

    return right(null);
  }
}
