import { PaginatedResult } from '@root/core/dto/paginated-result';
import { History } from '@root/domain/enterprise/value-object/history';
import { Workout } from '@root/domain/enterprise/value-object/workout';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from 'src/core/logic/Maybe';
import { WorkoutEntity } from 'src/domain/enterprise/entities/workout.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type CreateProps = {
  workout: WorkoutEntity;
};

export type DeleteProps = {
  workoutId: UniqueEntityId;
};

export type FindAllByUserIdProps = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

export type FindWorkoutsHistoryByUserIdProps = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
  query?: string;
};

export type FindTotalCountByUserIdProps = {
  userId: UniqueEntityId;
};

export type FindTotalAndAvgTimeProps = {
  userId: UniqueEntityId;
};

export abstract class WorkoutRepository {
  abstract create({ workout }: CreateProps): AsyncMaybe<WorkoutEntity>;
  abstract delete({ workoutId }: DeleteProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<Workout | null>;
  abstract findAllByUserId({ userId, limit, page }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<Workout[]>>;
  abstract findTotalCountByUserId({
    userId,
  }: FindTotalCountByUserIdProps): AsyncMaybe<{ totalCount: number; since?: Date }>;
  abstract findWorkoutsHistoryByUserId({
    userId,
    limit,
    page,
    query,
  }: FindWorkoutsHistoryByUserIdProps): AsyncMaybe<PaginatedResult<History[]>>;
  abstract findTotalAndAvgTime({
    userId,
  }: FindTotalAndAvgTimeProps): AsyncMaybe<{ totalSeconds: number; avgSeconds: number }>;
}
