import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  DeleteProps,
  FindAllByExerciseIdProps,
  FindAllLogsTodayProps,
  FindLogTodayByExerciseIdProps,
  FindByIdProps,
  LogRepository,
} from '@root/domain/application/repositories/log.repository';
import { LogEntity } from '@root/domain/enterprise/entities/log.entity';
import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { endOfDay, startOfDay } from 'date-fns';

import { LogMapper } from '../mappers/log.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaLogRepository implements LogRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ log }: CreateProps): AsyncMaybe<LogEntity> {
    const raw = LogMapper.toPersistence(log);

    await this.prismaService.log.create({ data: raw });

    return Maybe.some(log);
  }

  async delete({ logId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.log.delete({
      where: {
        id: logId.toValue(),
      },
    });

    return Maybe.none();
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<LogEntity | null> {
    const log = await this.prismaService.log.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!log) return Maybe.none();

    const logEntity = LogMapper.toDomain(log);

    return Maybe.some(logEntity);
  }

  async findAllByExerciseId({
    exerciseId,
    userId,
    limit,
    page,
  }: FindAllByExerciseIdProps): AsyncMaybe<PaginatedResult<LogEntity[]>> {
    const [logs, totalCount] = await this.prismaService.$transaction([
      this.prismaService.log.findMany({
        where: {
          exerciseId: exerciseId.toValue(),
          userId: userId.toValue(),
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.log.count({
        where: {
          exerciseId: exerciseId.toValue(),
          userId: userId.toValue(),
        },
      }),
    ]);

    const mappedLogs = logs.map(LogMapper.toDomain);

    return Maybe.some({
      data: mappedLogs,
      meta: {
        page,
        perPage: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  async findLogTodayByExerciseId({ exerciseId }: FindLogTodayByExerciseIdProps): AsyncMaybe<{ id: string } | null> {
    const todayStart = startOfDay(getBrasilUTCDate());
    const todayEnd = endOfDay(getBrasilUTCDate());

    const log = await this.prismaService.log.findFirst({
      where: {
        exerciseId: exerciseId.toValue(),
        createdAt: {
          gte: todayStart,
          lt: todayEnd,
        },
      },
      select: {
        id: true,
      },
    });

    if (!log) return Maybe.none();

    return Maybe.some(log);
  }

  async findAllLogsToday({
    userId,
    workoutId,
  }: FindAllLogsTodayProps): AsyncMaybe<{ totalCompleted: number; totalExercises: number }> {
    const todayStart = startOfDay(getBrasilUTCDate());
    const todayEnd = endOfDay(getBrasilUTCDate());

    const [totalExercises, totalCompleted] = await this.prismaService.$transaction([
      this.prismaService.exercise.count({
        where: {
          workoutId: workoutId.toValue(),
          userId: userId.toValue(),
        },
      }),
      this.prismaService.log.count({
        where: {
          userId: userId.toValue(),
          createdAt: {
            gte: todayStart,
            lt: todayEnd,
          },
          exercise: {
            workoutId: workoutId.toValue(),
          },
        },
      }),
    ]);

    return Maybe.some({
      totalCompleted,
      totalExercises,
    });
  }
}
