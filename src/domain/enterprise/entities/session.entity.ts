import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';

export type SessionEntityProps = {
  startTime: Date;
  endTime?: Date;
  workoutId: UniqueEntityId;
  userId: UniqueEntityId;
};

export class SessionEntity extends Entity<SessionEntityProps> {
  get startTime() {
    return this.props.startTime;
  }

  get endTime() {
    return this.props.endTime;
  }

  set endTime(endTime: Date) {
    this.props.endTime = endTime;
  }

  get workoutId() {
    return this.props.workoutId;
  }

  get userId() {
    return this.props.userId;
  }

  static create(props: SessionEntityProps, id?: UniqueEntityId) {
    return new SessionEntity(
      {
        startTime: props.startTime,
        endTime: props.endTime ?? undefined,
        userId: props.userId,
        workoutId: props.workoutId,
      },
      id,
    );
  }
}
