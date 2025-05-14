import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

export type PhysicalEntityProps = {
  height: number;
  weight: number;
  age: number;
  bodyFat?: number;
  muscleMass?: number;
  goal: string;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export type EditPhysicalEntityProps = {
  height?: number;
  weight?: number;
  age?: number;
  bodyFat?: number;
  muscleMass?: number;
  goal?: string;
};

export class PhysicalEntity extends Entity<PhysicalEntityProps> {
  get height() {
    return this.props.height;
  }

  get weight() {
    return this.props.weight;
  }

  get bodyFat() {
    return this.props.bodyFat;
  }

  get age() {
    return this.props.age;
  }

  get goal() {
    return this.props.goal;
  }

  get muscleMass() {
    return this.props.muscleMass;
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

  static create(props: Optional<PhysicalEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new PhysicalEntity(
      {
        age: props.age,
        goal: props.goal,
        height: props.height,
        weight: props.weight,
        bodyFat: props.bodyFat,
        muscleMass: props.muscleMass,
        userId: props.userId,
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: props.updatedAt || undefined,
      },
      id,
    );
  }

  public update(props: EditPhysicalEntityProps) {
    this.props.age = props.age ?? this.props.age;
    this.props.bodyFat = props.bodyFat ?? this.props.bodyFat;
    this.props.goal = props.goal ?? this.props.goal;
    this.props.height = props.height ?? this.props.height;
    this.props.muscleMass = props.muscleMass ?? this.props.muscleMass;
    this.props.weight = props.weight ?? this.props.weight;
    this.touch();

    return this;
  }
}
