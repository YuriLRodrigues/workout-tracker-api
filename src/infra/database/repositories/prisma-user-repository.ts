import { Injectable } from '@nestjs/common';
import { AsyncMaybe, Maybe } from 'src/core/logic/Maybe';
import {
  DeleteProps,
  FindByEmailProps,
  FindByIdProps,
  meProps,
  RegisterProps,
  SaveProps,
  UserRepository,
} from 'src/domain/application/repositories/user.repository';
import { UserEntity } from 'src/domain/enterprise/entities/user.entity';

import { UserMapper } from '../mappers/user.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prismaService: PrismaService) {}
  async me({ userId }: meProps): AsyncMaybe<UserEntity> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMapper.toDomain(user);

    return Maybe.some(mappedUser);
  }
  async findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMapper.toDomain(user);

    return Maybe.some(mappedUser);
  }
  async findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return Maybe.none();
    }

    const mappedUser = UserMapper.toDomain(user);

    return Maybe.some(mappedUser);
  }
  async register({ user }: RegisterProps): AsyncMaybe<UserEntity> {
    const raw = UserMapper.toPersistence(user);

    await this.prismaService.user.create({
      data: raw,
    });

    return Maybe.some(user);
  }

  async save({ user }: SaveProps): AsyncMaybe<UserEntity> {
    const raw = UserMapper.toPersistence(user);

    const updatedUser = await this.prismaService.user.update({
      where: {
        id: user.id.toValue(),
      },
      data: raw,
    });

    const mappedUser = UserMapper.toDomain(updatedUser);

    return Maybe.some(mappedUser);
  }

  async delete({ userId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.user.delete({
      where: {
        id: userId.toValue(),
      },
    });

    return Maybe.none();
  }
}
