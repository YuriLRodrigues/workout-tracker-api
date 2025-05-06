import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ValueObject } from 'src/core/domain/value-object/value-object';

import { ExecutionType, MuscleType } from '../types/exercise';

export type ExerciseProps = {
  id: UniqueEntityId;
  name: string;
  description: string;
  muscleType: MuscleType;
  executionType: ExecutionType;
  targetSets: number;
  targetResTime: number;
  targetRepetitions: number;
  maxWeight: number;
  lastWeight: number;
  videoReference: string;
  userId: UniqueEntityId;
  workoutId: UniqueEntityId;
  logs: Array<{
    id: UniqueEntityId;
    maxRepeat: number;
    maxSeries: number;
    maxWeight: number;
    averageRestTime: number;
    notes: string;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt?: Date;
};

export class Exercise extends ValueObject<ExerciseProps> {
  get id() {
    return this.props.id;
  }

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

  get maxWeight() {
    return this.props.maxWeight;
  }

  get lastWeight() {
    return this.props.lastWeight;
  }

  get videoReference() {
    return this.props.videoReference;
  }

  get workoutId() {
    return this.props.workoutId;
  }

  get logs() {
    return this.props.logs;
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

  static create(props: ExerciseProps) {
    return new Exercise({
      id: props.id,
      name: props.name,
      description: props.description,
      muscleType: props.muscleType,
      executionType: props.executionType,
      targetSets: props.targetSets,
      targetResTime: props.targetResTime,
      targetRepetitions: props.targetRepetitions,
      maxWeight: props.maxWeight,
      lastWeight: props.lastWeight,
      videoReference: props.videoReference,
      workoutId: props.workoutId,
      logs: props.logs,
      userId: props.userId,
      createdAt: props.createdAt,
      updatedAt: props.updatedAt,
    });
  }
}
