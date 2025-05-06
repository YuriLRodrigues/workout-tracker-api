import { Prisma, Log } from '@prisma/client';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { LogEntity } from 'src/domain/enterprise/entities/log.entity';

export class LogMapper {
  static toPersistence(data: LogEntity): Prisma.LogCreateInput {
    return {
      id: data.id.toValue(),
      averageRestTime: data.averageRestTime,
      maxRepeat: data.maxRepeat,
      maxSeries: data.maxSeries,
      maxWeight: data.maxWeight,
      notes: data.notes ? data.notes : undefined,
      exercise: {
        connect: {
          id: data.exerciseId.toValue(),
        },
      },
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      createdAt: new Date(data.createdAt),
    };
  }

  static toDomain(data: Log): LogEntity {
    return LogEntity.create(
      {
        averageRestTime: data.averageRestTime,
        maxRepeat: data.maxRepeat,
        maxSeries: data.maxSeries,
        maxWeight: data.maxWeight,
        exerciseId: new UniqueEntityId(data.exerciseId),
        notes: data.notes ? data.notes : undefined,
        userId: new UniqueEntityId(data.userId),
        createdAt: data.createdAt,
      },
      new UniqueEntityId(data.id),
    );
  }
}
