import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { History } from '@root/domain/enterprise/value-object/history';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { SessionRepository } from '../../repositories/session.repository';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, PaginatedResult<History[]>>;

type Input = {
  userId: UniqueEntityId;
  limit: number;
  page: number;
};

@Injectable()
export class FindAllByUserIdUseCase {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async execute({ userId, limit, page }: Input): Promise<Output> {
    const { isNone: userNotFound } = await this.userRepository.findById({ id: userId });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const { value } = await this.sessionRepository.findAllByUserId({ userId, limit, page });

    return right(value);
  }
}
