import { PhysicalStats, Prisma } from '@prisma/client';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { PhysicalEntity } from 'src/domain/enterprise/entities/physical.entity';

export class PhysicalMapper {
  static toPersistence(data: PhysicalEntity): Prisma.PhysicalStatsCreateInput {
    return {
      id: data.id.toValue(),
      age: data.age,
      goal: data.goal,
      height: data.height,
      weight: data.weight,
      bodyFat: data.bodyFat ? data.bodyFat : undefined,
      muscleMass: data.muscleMass ? data.muscleMass : undefined,
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      createdAt: new Date(data.createdAt),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined,
    };
  }

  static toDomain(data: PhysicalStats): PhysicalEntity {
    return PhysicalEntity.create(
      {
        age: data.age,
        goal: data.goal,
        height: data.height,
        weight: data.weight,
        bodyFat: data.bodyFat,
        muscleMass: data.muscleMass,
        userId: new UniqueEntityId(data.userId),
        createdAt: data.createdAt,
        updatedAt: data.updatedAt ?? undefined,
      },
      new UniqueEntityId(data.id),
    );
  }
}
