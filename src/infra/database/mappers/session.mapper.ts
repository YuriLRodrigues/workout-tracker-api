import { Prisma, Session } from '@prisma/client';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { SessionEntity } from 'src/domain/enterprise/entities/session.entity';

export class SessionMapper {
  static toPersistence(data: SessionEntity): Prisma.SessionCreateInput {
    return {
      id: data.id.toValue(),
      startTime: data.startTime,
      endTime: data?.endTime ?? undefined,
      workout: {
        connect: {
          id: data.workoutId.toValue(),
        },
      },
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
    };
  }

  static toDomain(data: Session): SessionEntity {
    return SessionEntity.create(
      {
        startTime: data.startTime,
        userId: new UniqueEntityId(data.userId),
        workoutId: new UniqueEntityId(data.workoutId),
        endTime: data.endTime ?? undefined,
      },
      new UniqueEntityId(data.id),
    );
  }
}
