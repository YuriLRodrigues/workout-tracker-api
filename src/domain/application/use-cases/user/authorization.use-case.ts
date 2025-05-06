import { Injectable } from '@nestjs/common';
import { InactiveResourceError } from 'src/core/errors/inactive-resource-error';
import { InvalidCredentialsError } from 'src/core/errors/invalid-credentials-error';
import { Either, left, right } from 'src/core/logic/Either';

import { Encrypter } from '../../cryptography/encrypter';
import { HashGenerator } from '../../cryptography/hash-generator';
import { UserRepository } from '../../repositories/user.repository';

type Input = {
  email: string;
  password: string;
};

type Output = Either<InvalidCredentialsError | InactiveResourceError, string>;

@Injectable()
export class AuthorizationUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({ email, password }: Input): Promise<Output> {
    const { isNone: userNotExists, value: user } = await this.userRepository.findByEmail({
      email,
    });

    if (userNotExists()) {
      return left(new InvalidCredentialsError());
    }

    const isPasswordCorrect = await this.hashGenerator.compare(password, user.password);

    if (!isPasswordCorrect) {
      return left(new InvalidCredentialsError());
    }

    if (user.disabled) {
      return left(new InactiveResourceError());
    }

    const token = await this.encrypter.encrypt({
      sub: user.id.toValue(),
      name: user.name,
      email: user.email,
      role: user.role,
    });

    return right(token);
  }
}
