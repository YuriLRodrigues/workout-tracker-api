import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ValueObject } from 'src/core/domain/value-object/value-object';

export type WorkoutProps = {
  id: UniqueEntityId;
  name: string;
  description: string;
  icon: string;
  bannerUrl?: string;
  bannerBlurHash?: string;
  color: string;
  totalExercises: number;
  totalSets: number;
  totalRepetitions: number;
  userId: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class Workout extends ValueObject<WorkoutProps> {
  get id() {
    return this.props.id;
  }

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

  get bannerUrl() {
    return this.props.bannerUrl;
  }

  get bannerBlurHash() {
    return this.props.bannerBlurHash;
  }

  get userId() {
    return this.props.userId;
  }

  get totalExercises() {
    return this.props.totalExercises;
  }

  get totalSets() {
    return this.props.totalSets;
  }

  get totalRepetitions() {
    return this.props.totalRepetitions;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: WorkoutProps) {
    return new Workout({
      id: props.id,
      name: props.name,
      description: props.description,
      icon: props.icon,
      bannerUrl: props.bannerUrl,
      bannerBlurHash: props.bannerBlurHash,
      color: props.color,
      totalExercises: props.totalExercises,
      totalRepetitions: props.totalRepetitions,
      totalSets: props.totalSets,
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
