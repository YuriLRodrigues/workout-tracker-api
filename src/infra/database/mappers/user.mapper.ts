import { Prisma, User } from '@prisma/client';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { UserEntity } from 'src/domain/enterprise/entities/user.entity';
import { UserGender, UserRole } from 'src/domain/enterprise/types/user';

export class UserMapper {
  static toPersistence(data: UserEntity): Prisma.UserCreateInput {
    return {
      id: data.id.toValue(),
      name: data.name,
      email: data.email,
      lastName: data.lastName,
      birthDate: data.birthDate,
      gender: data.gender,
      disabled: data.disabled,
      phone: data.phone,
      role: data.role,
      password: data.password,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  static toDomain(data: User): UserEntity {
    return UserEntity.create(
      {
        name: data.name,
        email: data.email,
        password: data.password,
        lastName: data.lastName,
        birthDate: data.birthDate,
        gender: data.gender as UserGender,
        phone: data.phone,
        role: data.role as UserRole,
        disabled: data.disabled,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }
}
