import { Injectable } from '@nestjs/common';
import { ResourceAlreadyExistsError } from '@root/core/errors/resource-already-exists-error';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { NotAllowedError } from 'src/core/errors/not-allowed-error';
import { ResourceNotFoundError } from 'src/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';

import { HashGenerator } from '../../cryptography/hash-generator';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError | ResourceAlreadyExistsError | NotAllowedError, void>;

type Input = {
  oldPassword: string;
  newPassword: string;
  userId: UniqueEntityId;
};

@Injectable()
export class ChangeMyUserPasswordUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashRepository: HashGenerator,
  ) {}

  async execute({ newPassword, oldPassword, userId }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotFound()) return left(new ResourceNotFoundError());

    const passwordIsValid = await this.hashRepository.compare(oldPassword, user.password);

    if (!passwordIsValid) return left(new NotAllowedError());

    const isSameAsOldPassword = await this.hashRepository.compare(newPassword, user.password);

    if (isSameAsOldPassword) return left(new ResourceAlreadyExistsError());

    const newHashedPassword = await this.hashRepository.hash(newPassword);

    user.password = newHashedPassword;

    await this.userRepository.save({ user });

    return right(null);
  }
}
