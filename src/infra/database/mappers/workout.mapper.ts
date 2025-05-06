import { Prisma, Workout } from '@prisma/client';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { WorkoutEntity } from 'src/domain/enterprise/entities/workout.entity';

export class WorkoutMapper {
  static toPersistence(data: WorkoutEntity): Prisma.WorkoutCreateInput {
    return {
      id: data.id.toValue(),
      name: data.name,
      description: data.description,
      icon: data.icon,
      color: data.color,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  static toDomain(data: Workout): WorkoutEntity {
    return WorkoutEntity.create(
      {
        description: data.description,
        name: data.name,
        icon: data.icon,
        color: data.color,
        userId: new UniqueEntityId(data.userId),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }
}
