import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

import { ExecutionType, MuscleType } from '../types/exercise';

export type ExerciseEntityProps = {
  name: string;
  description: string;
  muscleType: MuscleType;
  executionType: ExecutionType;
  targetSets: number;
  targetResTime: number;
  targetRepetitions: number;
  videoReference?: string;
  userId: UniqueEntityId;
  workoutId: UniqueEntityId;
  bannerId?: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class ExerciseEntity extends Entity<ExerciseEntityProps> {
  get name() {
    return this.props.name;
  }

  get description() {
    return this.props.description;
  }

  get muscleType() {
    return this.props.muscleType;
  }

  get executionType() {
    return this.props.executionType;
  }

  get targetSets() {
    return this.props.targetSets;
  }

  get targetResTime() {
    return this.props.targetResTime;
  }

  get targetRepetitions() {
    return this.props.targetRepetitions;
  }

  get videoReference() {
    return this.props.videoReference;
  }

  get workoutId() {
    return this.props.workoutId;
  }

  get bannerId() {
    return this.props.bannerId;
  }

  set bannerId(bannerId: UniqueEntityId) {
    this.props.bannerId = bannerId;
    this.touch();
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

  static create(props: Optional<ExerciseEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new ExerciseEntity(
      {
        name: props.name,
        description: props.description,
        executionType: props.executionType,
        muscleType: props.muscleType,
        targetResTime: props.targetResTime,
        targetRepetitions: props.targetRepetitions,
        targetSets: props.targetSets,
        videoReference: props.videoReference,
        workoutId: props.workoutId,
        userId: props.userId,
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: getBrasilUTCDate(),
      },
      id,
    );
  }
}
