import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { ResourceNotFoundError } from '@root/core/errors/resource-not-found-error';
import { Either, left, right } from 'src/core/logic/Either';
import { UserEntity } from 'src/domain/enterprise/entities/user.entity';
import { UserGender } from 'src/domain/enterprise/types/user';

import { UserRepository } from '../../repositories/user.repository';

type Output = Either<ResourceNotFoundError, UserEntity>;

type Input = {
  userId: UniqueEntityId;
  name?: string;
  lastName?: string;
  phone?: string;
  birthDate?: Date;
  gender?: UserGender;
};

@Injectable()
export class UpdateUserPersonalInfoUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute({ userId, name, lastName, birthDate, gender, phone }: Input): Promise<Output> {
    const { isNone: userNotFound, value: user } = await this.userRepository.findById({
      id: userId,
    });

    if (userNotFound()) {
      return left(new ResourceNotFoundError());
    }

    const updatedUser = user.updatePersonalInfo({
      birthDate,
      gender,
      lastName,
      name,
      phone,
    });

    await this.userRepository.save({ user: updatedUser });

    return right(user);
  }
}
