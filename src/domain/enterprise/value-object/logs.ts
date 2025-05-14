import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ValueObject } from 'src/core/domain/value-object/value-object';

import { ExecutionType } from '../types/exercise';

export type LogsProps = {
  id: UniqueEntityId;
  maxSeries: number;
  maxWeight: number;
  maxRepeat: number;
  averageRestTime: number;
  effortLevel: number;
  notes?: string;
  exerciseExecutionType: ExecutionType;
  sessionId?: UniqueEntityId;
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
  createdAt: Date;
};

export class Logs extends ValueObject<LogsProps> {
  get id() {
    return this.props.id;
  }

  get maxSeries() {
    return this.props.maxSeries;
  }

  get maxWeight() {
    return this.props.maxWeight;
  }

  get maxRepeat() {
    return this.props.maxRepeat;
  }

  get effortLevel() {
    return this.props.effortLevel;
  }

  get averageRestTime() {
    return this.props.averageRestTime;
  }

  get notes() {
    return this.props.notes;
  }

  get exerciseExecutionType() {
    return this.props.exerciseExecutionType;
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

  static create(props: LogsProps) {
    return new Logs({
      id: props.id,
      exerciseExecutionType: props.exerciseExecutionType,
      averageRestTime: props.averageRestTime,
      maxRepeat: props.maxRepeat,
      maxSeries: props.maxSeries,
      maxWeight: props.maxWeight,
      effortLevel: props.effortLevel,
      notes: props.notes,
      exerciseId: props.exerciseId,
      userId: props.userId,
      sessionId: props.sessionId,
      createdAt: props.createdAt,
    });
  }
}
