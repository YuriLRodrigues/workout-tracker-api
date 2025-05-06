import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

export type LogEntityProps = {
  maxSeries: number;
  maxWeight: number;
  maxRepeat: number;
  averageRestTime: number;
  notes?: string;
  sessionId?: UniqueEntityId;
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
  createdAt: Date;
};

export class LogEntity extends Entity<LogEntityProps> {
  get maxSeries() {
    return this.props.maxSeries;
  }

  get maxWeight() {
    return this.props.maxWeight;
  }

  get maxRepeat() {
    return this.props.maxRepeat;
  }

  get averageRestTime() {
    return this.props.averageRestTime;
  }

  get notes() {
    return this.props.notes;
  }

  get userId() {
    return this.props.userId;
  }

  get sessionId() {
    return this.props.sessionId;
  }

  get exerciseId() {
    return this.props.exerciseId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: Optional<LogEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new LogEntity(
      {
        averageRestTime: props.averageRestTime,
        maxRepeat: props.maxRepeat,
        maxSeries: props.maxSeries,
        maxWeight: props.maxWeight,
        notes: props.notes,
        exerciseId: props.exerciseId,
        userId: props.userId,
        sessionId: props.sessionId,
        createdAt: props.createdAt || getBrasilUTCDate(),
      },
      id,
    );
  }
}
