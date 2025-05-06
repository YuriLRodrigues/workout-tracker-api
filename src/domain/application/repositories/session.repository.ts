import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { SessionEntity } from '@root/domain/enterprise/entities/session.entity';
import { History } from '@root/domain/enterprise/value-object/history';

export type CreateProps = {
  session: SessionEntity;
};

export type FindByWorkoutIdProps = {
  workoutId: UniqueEntityId;
};

export type FindByIdProps = {
  sessionId: UniqueEntityId;
};

export type UpdateProps = {
  session: SessionEntity;
};

export type FindAverageByWeekProps = {
  userId: UniqueEntityId;
};

export type FindTotalLoadByWeekProps = {
  userId: UniqueEntityId;
};

export type FindTotalSeriesByWeekProps = {
  userId: UniqueEntityId;
};

export type FindAllByUserIdProps = {
  userId: UniqueEntityId;
  page: number;
  limit: number;
};

export type FindFrequencyByWeekAndUserIdProps = {
  userId: UniqueEntityId;
};

export abstract class SessionRepository {
  abstract create({ session }: CreateProps): AsyncMaybe<null>;
  abstract findTodayByWorkoutId({ workoutId }: FindByWorkoutIdProps): AsyncMaybe<SessionEntity | null>;
  abstract findById({ sessionId }: FindByIdProps): AsyncMaybe<SessionEntity>;
  abstract update({ session }: UpdateProps): AsyncMaybe<null>;
  abstract findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<History[]>>;
  abstract findAverageWorkoutByWeek({ userId }: FindAverageByWeekProps): AsyncMaybe<{
    thisWeekCount: number;
    workoutDiffCount: number;
  }>;
  abstract findAverageTimeByWeek({ userId }: FindAverageByWeekProps): AsyncMaybe<{
    totalThisWeekSeconds: number;
    timeDiffSeconds: number;
  }>;
  abstract findTotalLoadByWeek({
    userId,
  }: FindTotalLoadByWeekProps): AsyncMaybe<{ thisWeekTotal: number; loadDiff: number }>;
  abstract findTotalSeriesByWeek({
    userId,
  }: FindTotalSeriesByWeekProps): AsyncMaybe<{ thisWeekTotal: number; seriesDiff: number }>;
  abstract findFrequencyByWeekAndUserId({
    userId,
  }: FindFrequencyByWeekAndUserIdProps): AsyncMaybe<{ frequency: number }>;
}
