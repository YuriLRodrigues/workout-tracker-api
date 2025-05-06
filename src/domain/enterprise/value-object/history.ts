import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ValueObject } from 'src/core/domain/value-object/value-object';

export type HistoryProps = {
  id: UniqueEntityId;
  startTime: Date;
  endTime: Date;
  color: string;
  icon: string;
  workoutName: string;
  workoutDescription: string;
  workoutId: UniqueEntityId;
};

export class History extends ValueObject<HistoryProps> {
  get id() {
    return this.props.id;
  }

  get startTime() {
    return this.props.startTime;
  }

  get endTime() {
    return this.props.endTime;
  }

  get color() {
    return this.props.color;
  }

  get icon() {
    return this.props.icon;
  }

  get workoutDescription() {
    return this.props.workoutDescription;
  }

  get workoutName() {
    return this.props.workoutName;
  }

  get workoutId() {
    return this.props.workoutId;
  }

  static create(props: HistoryProps) {
    return new History({
      id: props.id,
      color: props.color,
      endTime: props.endTime,
      icon: props.icon,
      startTime: props.startTime,
      workoutName: props.workoutName,
      workoutId: props.workoutId,
      workoutDescription: props.workoutDescription,
    });
  }
}
