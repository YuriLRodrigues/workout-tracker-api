import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  FindAllByUserIdProps,
  FindAverageByWeekProps,
  FindByIdProps,
  FindByWorkoutIdProps,
  FindFrequencyByWeekAndUserIdProps,
  FindTotalLoadByWeekProps,
  FindTotalSeriesByWeekProps,
  SessionRepository,
  UpdateProps,
} from '@root/domain/application/repositories/session.repository';
import { SessionEntity } from '@root/domain/enterprise/entities/session.entity';
import { History } from '@root/domain/enterprise/value-object/history';
import { getBrasilDayRange, getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { subWeeks, startOfWeek, endOfWeek } from 'date-fns';

import { SessionMapper } from '../mappers/session.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ session }: CreateProps): AsyncMaybe<null> {
    const raw = SessionMapper.toPersistence(session);

    await this.prismaService.session.create({ data: raw });

    return Maybe.none();
  }

  async findTodayByWorkoutId({ workoutId }: FindByWorkoutIdProps): AsyncMaybe<SessionEntity> {
    const { end, start } = getBrasilDayRange();

    const session = await this.prismaService.session.findFirst({
      where: {
        workoutId: workoutId.toValue(),
        createdAt: {
          gte: start,
          lte: end,
        },
      },
    });

    if (!session) return Maybe.none();

    const sessionEntity = SessionMapper.toDomain(session);

    return Maybe.some(sessionEntity);
  }

  async findById({ sessionId }: FindByIdProps): AsyncMaybe<SessionEntity> {
    const session = await this.prismaService.session.findUnique({
      where: {
        id: sessionId.toValue(),
      },
    });

    if (!session) return Maybe.none();

    const sessionEntity = SessionMapper.toDomain(session);

    return Maybe.some(sessionEntity);
  }

  async update({ session }: UpdateProps): AsyncMaybe<null> {
    const raw = SessionMapper.toPersistence(session);

    await this.prismaService.session.update({
      data: raw,
      where: {
        id: session.id.toValue(),
      },
    });

    return Maybe.none();
  }

  async findAllByUserId({ limit, page, userId }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<History[]>> {
    const [sessions, totalCount] = await this.prismaService.$transaction([
      this.prismaService.session.findMany({
        where: {
          userId: userId.toValue(),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          workout: {
            select: {
              color: true,
              icon: true,
              name: true,
              id: true,
              description: true,
            },
          },
        },
      }),
      this.prismaService.session.count({
        where: {
          userId: userId.toValue(),
        },
      }),
    ]);

    const mappedSessions = sessions.map((session) => {
      return History.create({
        color: session.workout.color,
        endTime: session.endTime,
        startTime: session.startTime,
        icon: session.workout.icon,
        id: new UniqueEntityId(session.id),
        workoutName: session.workout.name,
        workoutId: new UniqueEntityId(session.workout.id),
        workoutDescription: session.workout.description,
      });
    });

    return Maybe.some({
      data: mappedSessions,
      meta: {
        page,
        perPage: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  async findAverageWorkoutByWeek({
    userId,
  }: FindAverageByWeekProps): AsyncMaybe<{ thisWeekCount: number; workoutDiffCount: number }> {
    const startOfThisWeek = startOfWeek(getBrasilUTCDate());
    const endOfThisWeek = endOfWeek(getBrasilUTCDate());
    const startOfLastWeek = subWeeks(startOfThisWeek, 1);
    const endOfLastWeek = subWeeks(endOfThisWeek, 1);

    const [thisWeekCount, lastWeekCount] = await this.prismaService.$transaction([
      this.prismaService.session.count({
        where: {
          userId: userId.toValue(),
          startTime: { gte: startOfThisWeek, lte: endOfThisWeek },
        },
      }),
      this.prismaService.session.count({
        where: {
          userId: userId.toValue(),
          startTime: { gte: startOfLastWeek, lte: endOfLastWeek },
        },
      }),
    ]);

    const workoutDiffCount = thisWeekCount - lastWeekCount;

    return Maybe.some({
      thisWeekCount,
      workoutDiffCount,
    });
  }

  async findAverageTimeByWeek({
    userId,
  }: FindAverageByWeekProps): AsyncMaybe<{ totalThisWeekSeconds: number; timeDiffSeconds: number }> {
    const startOfThisWeek = startOfWeek(getBrasilUTCDate());
    const endOfThisWeek = endOfWeek(getBrasilUTCDate());
    const startOfLastWeek = subWeeks(startOfThisWeek, 1);
    const endOfLastWeek = subWeeks(endOfThisWeek, 1);

    const [thisWeekSessions, lastWeekSessions] = await this.prismaService.$transaction([
      this.prismaService.session.findMany({
        where: {
          userId: userId.toValue(),
          startTime: { gte: startOfThisWeek, lte: endOfThisWeek },
          endTime: { not: null },
        },
        select: { startTime: true, endTime: true },
      }),
      this.prismaService.session.findMany({
        where: {
          userId: userId.toValue(),
          startTime: { gte: startOfLastWeek, lte: endOfLastWeek },
          endTime: { not: null },
        },
        select: { startTime: true, endTime: true },
      }),
    ]);

    const getTotalSeconds = (sessions: { startTime: Date; endTime: Date | null }[]) =>
      sessions.reduce((acc, session) => {
        if (!session.endTime) return acc;
        const diffSeconds = (session.endTime.getTime() - session.startTime.getTime()) / 1000;
        return acc + diffSeconds;
      }, 0);

    const thisWeekTotal = getTotalSeconds(thisWeekSessions);
    const lastWeekTotal = getTotalSeconds(lastWeekSessions);

    const timeDiffSeconds = thisWeekTotal - lastWeekTotal;

    // Se thisWeekTotal for 0, retorna a diferença negativa (para indicar diminuição)
    const adjustedTimeDiffSeconds = thisWeekTotal === 0 ? -lastWeekTotal : timeDiffSeconds;

    return Maybe.some({
      totalThisWeekSeconds: thisWeekTotal,
      timeDiffSeconds: adjustedTimeDiffSeconds,
    });
  }

  async findTotalLoadByWeek({
    userId,
  }: FindTotalLoadByWeekProps): AsyncMaybe<{ thisWeekTotal: number; loadDiff: number }> {
    const startOfThisWeek = startOfWeek(getBrasilUTCDate());
    const endOfThisWeek = endOfWeek(getBrasilUTCDate());
    const startOfLastWeek = subWeeks(startOfThisWeek, 1);
    const endOfLastWeek = subWeeks(endOfThisWeek, 1);

    const [thisWeekLogs, lastWeekLogs] = await this.prismaService.$transaction([
      this.prismaService.log.findMany({
        where: {
          userId: userId.toValue(),
          createdAt: { gte: startOfThisWeek, lte: endOfThisWeek },
        },
        select: {
          maxWeight: true,
        },
      }),
      this.prismaService.log.findMany({
        where: {
          userId: userId.toValue(),
          createdAt: { gte: startOfLastWeek, lte: endOfLastWeek },
        },
        select: {
          maxWeight: true,
        },
      }),
    ]);

    const sumWeights = (logs: { maxWeight: number }[]) => logs.reduce((acc, log) => acc + (log.maxWeight || 0), 0);

    const thisWeekTotal = Math.round(sumWeights(thisWeekLogs));
    const lastWeekTotal = Math.round(sumWeights(lastWeekLogs));

    const loadDiff = thisWeekTotal - lastWeekTotal;

    return Maybe.some({
      thisWeekTotal,
      loadDiff,
    });
  }

  async findTotalSeriesByWeek({
    userId,
  }: FindTotalSeriesByWeekProps): AsyncMaybe<{ thisWeekTotal: number; seriesDiff: number }> {
    const startOfThisWeek = startOfWeek(getBrasilUTCDate());
    const endOfThisWeek = endOfWeek(getBrasilUTCDate());
    const startOfLastWeek = subWeeks(startOfThisWeek, 1);
    const endOfLastWeek = subWeeks(endOfThisWeek, 1);

    const [thisWeekLogs, lastWeekLogs] = await this.prismaService.$transaction([
      this.prismaService.log.findMany({
        where: {
          userId: userId.toValue(),
          createdAt: { gte: startOfThisWeek, lte: endOfThisWeek },
        },
        select: {
          maxSeries: true,
        },
      }),
      this.prismaService.log.findMany({
        where: {
          userId: userId.toValue(),
          createdAt: { gte: startOfLastWeek, lte: endOfLastWeek },
        },
        select: {
          maxSeries: true,
        },
      }),
    ]);

    const sumReps = (logs: { maxSeries: number }[]) => logs.reduce((acc, log) => acc + (log.maxSeries || 0), 0);

    const thisWeekTotal = sumReps(thisWeekLogs);
    const lastWeekTotal = sumReps(lastWeekLogs);

    const seriesDiff = thisWeekTotal - lastWeekTotal;

    return Maybe.some({
      thisWeekTotal,
      seriesDiff,
    });
  }

  async findFrequencyByWeekAndUserId({ userId }: FindFrequencyByWeekAndUserIdProps): AsyncMaybe<{ frequency: number }> {
    const sessions = await this.prismaService.session.findMany({
      where: { userId: userId.toValue(), endTime: { not: null } },
      select: { startTime: true },
    });

    if (sessions.length === 0) {
      return Maybe.some({ frequency: 0 });
    }

    const dates = sessions.map((session) => session.startTime);
    const earliest = new Date(Math.min(...dates.map((d) => d.getTime())));
    const latest = new Date(Math.max(...dates.map((d) => d.getTime())));

    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const diffMs = latest.getTime() - earliest.getTime();
    const weeks = Math.max(1, Math.ceil(diffMs / msInWeek));

    const frequency = sessions.length / weeks;

    return Maybe.some({ frequency: parseFloat(frequency.toFixed(2)) });
  }
}
