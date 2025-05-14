import { Injectable } from '@nestjs/common';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { LogEntity } from '@root/domain/enterprise/entities/log.entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { ImageRepository } from '../../repositories/image.repository';
import { LogRepository } from '../../repositories/log.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, void>;

type Input = {
  averageRestTime: number;
  maxRepeat: number;
  maxSeries: number;
  maxWeight: number;
  effortLevel: number;
  notes?: string;
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
  sessionId?: UniqueEntityId;
};

@Injectable()
export class CreateLogUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly imageRepository: ImageRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async execute({
    exerciseId,
    sessionId,
    userId,
    averageRestTime,
    maxRepeat,
    effortLevel,
    maxSeries,
    maxWeight,
    notes,
  }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const log = LogEntity.create({
      averageRestTime,
      exerciseId,
      effortLevel,
      maxRepeat,
      maxSeries,
      maxWeight,
      notes,
      userId,
      sessionId,
    });

    await this.logRepository.create({ log });

    return right(null);
  }
}
