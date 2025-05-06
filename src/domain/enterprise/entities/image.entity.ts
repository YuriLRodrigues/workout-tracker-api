import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

import { ImageType } from '../types/image';

export type ImageEntityProps = {
  url: string;
  blurHash: string;
  type: ImageType;
  userId: UniqueEntityId;
  workoutId?: UniqueEntityId;
  exerciseId?: UniqueEntityId;
  uploadUniqueName: string;
  createdAt: Date;
  updatedAt?: Date;
};

export class ImageEntity extends Entity<ImageEntityProps> {
  get url() {
    return this.props.url;
  }

  get blurHash() {
    return this.props.blurHash;
  }

  get type() {
    return this.props.type;
  }

  get userId() {
    return this.props.userId;
  }

  get workoutId() {
    return this.props.workoutId;
  }

  set workoutId(workoutId: UniqueEntityId) {
    this.props.workoutId = workoutId;
    this.touch();
  }

  get exerciseId() {
    return this.props.exerciseId;
  }

  set exerciseId(exerciseId: UniqueEntityId) {
    this.props.exerciseId = exerciseId;
    this.touch();
  }

  get uploadUniqueName() {
    return this.props.uploadUniqueName;
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

  static create(props: Optional<ImageEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new ImageEntity(
      {
        url: props.url,
        blurHash: props.blurHash,
        type: props.type,
        userId: props.userId,
        workoutId: props.workoutId,
        exerciseId: props.exerciseId,
        uploadUniqueName: props.uploadUniqueName,
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: getBrasilUTCDate(),
      },
      id,
    );
  }
}
