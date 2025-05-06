import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

export type WorkoutEntityProps = {
  name: string;
  description: string;
  icon: string;
  color: string;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class WorkoutEntity extends Entity<WorkoutEntityProps> {
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get icon() {
    return this.props.icon;
  }

  get color() {
    return this.props.color;
  }

  get userId() {
    return this.props.userId;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = getBrasilUTCDate();
  }

  static create(props: Optional<WorkoutEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new WorkoutEntity(
      {
        name: props.name,
        description: props.description,
        icon: props.icon,
        color: props.color,
        userId: props.userId,
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: getBrasilUTCDate(),
      },
      id,
    );
  }
}
