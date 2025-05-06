import { PaginatedResult } from '@root/core/dto/paginated-result';
import { Exercise } from '@root/domain/enterprise/value-object/exercise';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from 'src/core/logic/Maybe';
import { ExerciseEntity } from 'src/domain/enterprise/entities/exercise.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type CreateProps = {
  exercise: ExerciseEntity;
};

export type DeleteProps = {
  exerciseId: UniqueEntityId;
};

export type FindAllByWorkoutIdProps = {
  workoutId: UniqueEntityId;
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

export abstract class ExerciseRepository {
  abstract create({ exercise }: CreateProps): AsyncMaybe<ExerciseEntity>;
  abstract delete({ exerciseId }: DeleteProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<Exercise | null>;
  abstract findAllByWorkoutId({
    workoutId,
    userId,
    limit,
    page,
  }: FindAllByWorkoutIdProps): AsyncMaybe<PaginatedResult<Exercise[]>>;
}
