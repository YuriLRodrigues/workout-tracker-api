import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  DeleteProps,
  FindAllByUserIdProps,
  FindByIdProps,
  FindTotalAndAvgTimeProps,
  FindTotalCountByUserIdProps,
  FindWorkoutsHistoryByUserIdProps,
  WorkoutRepository,
} from '@root/domain/application/repositories/workout.repository';
import { WorkoutEntity } from '@root/domain/enterprise/entities/workout.entity';
import { History } from '@root/domain/enterprise/value-object/history';
import { Workout } from '@root/domain/enterprise/value-object/workout';

import { WorkoutMapper } from '../mappers/workout.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaWorkoutRepository implements WorkoutRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ workout }: CreateProps): AsyncMaybe<WorkoutEntity> {
    const raw = WorkoutMapper.toPersistence(workout);

    await this.prismaService.workout.create({ data: raw });

    return Maybe.some(workout);
  }

  async delete({ workoutId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.workout.delete({
      where: {
        id: workoutId.toValue(),
      },
    });

    return Maybe.none();
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<Workout | null> {
    const [workout, totalExercises, exerciseAggregations] = await this.prismaService.$transaction([
      this.prismaService.workout.findUnique({
        where: {
          id: id.toValue(),
        },
        include: {
          banner: {
            select: {
              id: true,
              url: true,
              blurHash: true,
            },
          },
        },
      }),
      this.prismaService.exercise.count({
        where: {
          workoutId: id.toValue(),
        },
      }),
      this.prismaService.exercise.aggregate({
        where: { workoutId: id.toValue() },
        _sum: { targetRepetitions: true, targetSets: true },
      }),
    ]);

    if (!workout) {
      return Maybe.none();
    }

    const mappedWorkout = Workout.create({
      id: new UniqueEntityId(workout.id),
      userId: new UniqueEntityId(workout.userId),
      name: workout.name,
      description: workout.description,
      bannerBlurHash: workout.banner?.blurHash,
      bannerUrl: workout.banner?.url,
      icon: workout.icon,
      color: workout.color,
      totalExercises: totalExercises || 0,
      totalRepetitions: exerciseAggregations._sum.targetRepetitions || 0,
      totalSets: exerciseAggregations._sum.targetSets || 0,
      createdAt: workout.createdAt,
      updatedAt: workout.updatedAt,
    });

    return Maybe.some(mappedWorkout);
  }

  async findAllByUserId({ userId, limit, page }: FindAllByUserIdProps): AsyncMaybe<PaginatedResult<Workout[]>> {
    const [workoutsByUser, totalCount] = await this.prismaService.$transaction([
      this.prismaService.workout.findMany({
        where: {
          userId: userId.toValue(),
        },
        select: {
          id: true,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prismaService.workout.count({
        where: {
          userId: userId.toValue(),
        },
      }),
    ]);

    const mappedWorkouts = await Promise.all(
      workoutsByUser.map(async (userWorkout) => {
        const [workout, totalExercises, exerciseAggregations] = await this.prismaService.$transaction([
          this.prismaService.workout.findUnique({
            where: {
              id: userWorkout.id,
            },
            include: {
              banner: {
                select: {
                  id: true,
                  url: true,
                  blurHash: true,
                },
              },
            },
          }),
          this.prismaService.exercise.count({
            where: {
              workoutId: userWorkout.id,
            },
          }),
          this.prismaService.exercise.aggregate({
            where: { workoutId: userWorkout.id, executionType: 'REPETITION' },
            _sum: { targetRepetitions: true, targetSets: true },
          }),
        ]);

        return Workout.create({
          id: new UniqueEntityId(workout.id),
          userId: new UniqueEntityId(workout.userId),
          name: workout.name,
          description: workout.description,
          bannerBlurHash: workout.banner?.blurHash,
          bannerUrl: workout.banner?.url,
          icon: workout.icon,
          color: workout.color,
          totalExercises: totalExercises || 0,
          totalRepetitions: exerciseAggregations._sum.targetRepetitions || 0,
          totalSets: exerciseAggregations._sum.targetSets || 0,
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,
        });
      }),
    );

    return Maybe.some({
      data: mappedWorkouts,
      meta: {
        page,
        perPage: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  async findWorkoutsHistoryByUserId({
    userId,
    limit,
    page,
    query,
  }: FindWorkoutsHistoryByUserIdProps): AsyncMaybe<PaginatedResult<History[]>> {
    const [sessionsByUser, totalCount] = await this.prismaService.$transaction([
      this.prismaService.session.findMany({
        where: { userId: userId.toValue(), workoutId: query ? query : undefined },
        select: { id: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { startTime: 'desc' },
      }),
      this.prismaService.session.count({
        where: { userId: userId.toValue() },
      }),
    ]);

    const mappedHistories = await Promise.all(
      sessionsByUser.map(async (session) => {
        const [sessionData, logsAggregation, totalExercises] = await this.prismaService.$transaction([
          this.prismaService.session.findUnique({
            where: { id: session.id },
            select: {
              id: true,
              startTime: true,
              endTime: true,
              workout: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  color: true,
                  icon: true,
                },
              },
            },
          }),
          this.prismaService.log.aggregate({
            where: { sessionId: session.id, exercise: { executionType: 'REPETITION' } },
            _sum: { maxWeight: true },
          }),
          this.prismaService.log.aggregate({
            where: { sessionId: session.id },
            _count: { exerciseId: true },
          }),
        ]);

        return History.create({
          id: new UniqueEntityId(sessionData.id),
          workoutId: new UniqueEntityId(sessionData.workout.id),
          startTime: sessionData.startTime,
          endTime: sessionData.endTime,
          color: sessionData.workout.color,
          icon: sessionData.workout.icon,
          workoutName: sessionData.workout.name,
          workoutDescription: sessionData.workout.description,
          totalLoad: logsAggregation._sum.maxWeight || 0,
          totalExercises: totalExercises._count.exerciseId || 0,
        });
      }),
    );

    return Maybe.some({
      data: mappedHistories,
      meta: {
        page,
        perPage: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }

  async findTotalAndAvgTime({
    userId,
  }: FindTotalAndAvgTimeProps): AsyncMaybe<{ totalSeconds: number; avgSeconds: number }> {
    const sessions = await this.prismaService.session.findMany({
      where: {
        userId: userId.toValue(),
        endTime: { not: null },
      },
      select: {
        startTime: true,
        endTime: true,
      },
    });

    const durations = sessions.map((session) => {
      const start = session.startTime.getTime();
      const end = session.endTime!.getTime();
      return end - start;
    });

    const totalMs = durations.reduce((acc, curr) => acc + curr, 0);
    const avgMs = durations.length > 0 ? totalMs / durations.length : 0;

    const totalSeconds = Math.floor(totalMs / 1000);
    const avgSeconds = Math.floor(avgMs / 1000);

    return Maybe.some({
      avgSeconds,
      totalSeconds,
    });
  }

  async findTotalCountByUserId({
    userId,
  }: FindTotalCountByUserIdProps): AsyncMaybe<{ totalCount: number; since?: Date }> {
    const [totalCount, since] = await this.prismaService.$transaction([
      this.prismaService.session.count({
        where: {
          userId: userId.toValue(),
          endTime: { not: null },
        },
      }),
      this.prismaService.session.findFirst({
        where: {
          userId: userId.toValue(),
          endTime: { not: null },
        },
        orderBy: {
          startTime: 'asc',
        },
        select: {
          startTime: true,
        },
      }),
    ]);

    return Maybe.some({
      totalCount,
      since: since?.startTime ?? null,
    });
  }
}
