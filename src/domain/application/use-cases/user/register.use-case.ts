import { Injectable } from '@nestjs/common';
import { ResourceAlreadyExistsError } from 'src/core/errors/resource-already-exists-error';
import { Either, left, right } from 'src/core/logic/Either';
import { UserEntity } from 'src/domain/enterprise/entities/user.entity';
import { UserRole } from 'src/domain/enterprise/types/user';

import { HashGenerator } from '../../cryptography/hash-generator';
import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceAlreadyExistsError, UserEntity>;

type Input = {
  name: string;
  lastName: string;
  email: string;
  password: string;
};

@Injectable()
export class RegisterUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({ email, name, lastName, password }: Input): Promise<Output> {
    const { isSome: userEmailExists } = await this.userRepository.findByEmail({
      email,
    });

    if (userEmailExists()) {
      return left(new ResourceAlreadyExistsError());
    }

    const hashedPassword = await this.hashGenerator.hash(password);

    const user = UserEntity.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      role: UserRole.USER,
    });

    await this.userRepository.register({ user });

    return right(user);
  }
}
