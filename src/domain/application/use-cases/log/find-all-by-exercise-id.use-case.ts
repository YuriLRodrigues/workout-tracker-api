import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { NotAllowedError } from '@root/core/errors/not-allowed-error';
import { Logs } from '@root/domain/enterprise/value-object/logs';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { LogRepository } from '../../repositories/log.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | NotAllowedError, PaginatedResult<Logs[]>>;

type Input = {
  userId: UniqueEntityId;
  exerciseId: UniqueEntityId;
  page: number;
  limit: number;
};

@Injectable()
export class FindAllLogsByExerciseIdUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly logRepository: LogRepository,
  ) {}

  async execute({ userId, exerciseId, limit, page }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value: logs } = await this.logRepository.findAllByExerciseId({ userId, exerciseId, limit, page });

    return right(logs);
  }
}
