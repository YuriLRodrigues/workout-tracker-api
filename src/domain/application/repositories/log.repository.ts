import { PaginatedResult } from '@root/core/dto/paginated-result';
import { LogEntity } from '@root/domain/enterprise/entities/log.entity';
import { Logs } from '@root/domain/enterprise/value-object/logs';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from 'src/core/logic/Maybe';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type CreateProps = {
  log: LogEntity;
};

export type DeleteProps = {
  logId: UniqueEntityId;
};

export type FindAllByExerciseIdProps = {
  exerciseId: UniqueEntityId;
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

export type FindLogTodayByExerciseIdProps = {
  exerciseId: UniqueEntityId;
};

export type FindAllLogsTodayProps = {
  workoutId: UniqueEntityId;
  userId: UniqueEntityId;
};

export abstract class LogRepository {
  abstract create({ log }: CreateProps): AsyncMaybe<LogEntity>;
  abstract delete({ logId }: DeleteProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<LogEntity | null>;
  abstract findAllByExerciseId({
    exerciseId,
    userId,
    limit,
    page,
  }: FindAllByExerciseIdProps): AsyncMaybe<PaginatedResult<Logs[]>>;
  abstract findLogTodayByExerciseId({ exerciseId }: FindLogTodayByExerciseIdProps): AsyncMaybe<{ id: string } | null>;
  abstract findAllLogsToday({
    userId,
    workoutId,
  }: FindAllLogsTodayProps): AsyncMaybe<{ totalCompleted: number; totalExercises: number }>;
}
