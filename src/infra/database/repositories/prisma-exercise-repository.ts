import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { PaginatedResult } from '@root/core/dto/paginated-result';
import { AsyncMaybe, Maybe } from '@root/core/logic/Maybe';
import {
  CreateProps,
  DeleteProps,
  ExerciseRepository,
  FindAllByWorkoutIdProps,
  FindByIdProps,
  UpdateProps,
} from '@root/domain/application/repositories/exercise.repository';
import { ExerciseEntity } from '@root/domain/enterprise/entities/exercise.entity';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { Exercise } from '@root/domain/enterprise/value-object/exercise';

import { ExerciseMapper } from '../mappers/exercise.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ exercise }: CreateProps): AsyncMaybe<ExerciseEntity> {
    const raw = ExerciseMapper.toPersistence(exercise);

    await this.prismaService.exercise.create({
      data: raw,
    });

    return Maybe.some(exercise);
  }

  async update({ exercise }: UpdateProps): AsyncMaybe<void> {
    const raw = ExerciseMapper.toPersistence(exercise);

    await this.prismaService.exercise.update({
      data: raw,
      where: {
        id: exercise.id.toValue(),
      },
    });

    return Maybe.some(null);
  }

  async delete({ exerciseId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.exercise.delete({
      where: {
        id: exerciseId.toValue(),
      },
    });

    return Maybe.none();
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<Exercise | null> {
    const [exercise, maxWeightAggregate, lastLog] = await this.prismaService.$transaction([
      this.prismaService.exercise.findUnique({
        where: {
          id: id.toValue(),
        },
        include: {
          logs: {
            select: {
              id: true,
              maxRepeat: true,
              maxSeries: true,
              maxWeight: true,
              averageRestTime: true,
              notes: true,
              createdAt: true,
            },
          },
        },
      }),
      this.prismaService.log.aggregate({
        where: {
          exerciseId: id.toValue(),
        },
        _max: {
          maxWeight: true,
        },
      }),
      this.prismaService.log.findFirst({
        where: {
          exerciseId: id.toValue(),
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          maxWeight: true,
        },
      }),
    ]);

    if (!exercise) {
      return Maybe.none();
    }

    const exerciseEntity = Exercise.create({
      id: new UniqueEntityId(exercise.id),
      name: exercise.name,
      description: exercise.description,
      targetRepetitions: exercise.targetRepetitions,
      targetSets: exercise.targetSets,
      targetResTime: exercise.targetResTime,
      executionType: exercise.executionType as ExecutionType,
      muscleType: exercise.muscleType as MuscleType,
      maxWeight: maxWeightAggregate?._max?.maxWeight || 0,
      lastWeight: lastLog?.maxWeight || 0,
      videoReference: exercise.videoReference,
      userId: new UniqueEntityId(exercise.userId),
      workoutId: new UniqueEntityId(exercise.workoutId),
      logs: exercise.logs.map((log) => {
        return {
          id: new UniqueEntityId(log.id),
          averageRestTime: log.averageRestTime,
          maxRepeat: log.maxRepeat,
          maxSeries: log.maxSeries,
          maxWeight: log.maxWeight,
          notes: log.notes,
          createdAt: log.createdAt,
        };
      }),
      createdAt: exercise.createdAt,
      updatedAt: exercise.updatedAt,
    });

    return Maybe.some(exerciseEntity);
  }

  async findAllByWorkoutId({
    workoutId,
    userId,
    limit,
    page,
  }: FindAllByWorkoutIdProps): AsyncMaybe<PaginatedResult<Exercise[]>> {
    const [exercises, totalCount] = await this.prismaService.$transaction([
      this.prismaService.exercise.findMany({
        where: {
          workoutId: workoutId.toValue(),
          userId: userId.toValue(),
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          logs: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      }),
      this.prismaService.exercise.count({
        where: {
          workoutId: workoutId.toValue(),
          userId: userId.toValue(),
        },
      }),
    ]);

    const mappedExercises = await Promise.all(
      exercises.map(async (exercise) => {
        const [maxWeightAggregate, lastLog] = await this.prismaService.$transaction([
          this.prismaService.log.aggregate({
            where: {
              exerciseId: exercise.id,
              userId: userId.toValue(),
            },
            _max: {
              maxWeight: true,
            },
          }),
          this.prismaService.log.findFirst({
            where: {
              exerciseId: exercise.id,
              userId: userId.toValue(),
            },
            orderBy: {
              createdAt: 'desc',
            },
            select: {
              maxWeight: true,
            },
          }),
        ]);

        return Exercise.create({
          id: new UniqueEntityId(exercise.id),
          name: exercise.name,
          description: exercise.description,
          targetRepetitions: exercise.targetRepetitions,
          targetSets: exercise.targetSets,
          targetResTime: exercise.targetResTime,
          executionType: exercise.executionType as ExecutionType,
          muscleType: exercise.muscleType as MuscleType,
          maxWeight: maxWeightAggregate?._max?.maxWeight ?? 0,
          lastWeight: lastLog?.maxWeight ?? 0,
          videoReference: exercise.videoReference,
          userId: new UniqueEntityId(exercise.userId),
          workoutId: new UniqueEntityId(exercise.workoutId),
          logs: exercise.logs.map((log) => {
            return {
              id: new UniqueEntityId(log.id),
              averageRestTime: log.averageRestTime,
              maxRepeat: log.maxRepeat,
              maxSeries: log.maxSeries,
              maxWeight: log.maxWeight,
              notes: log.notes,
              createdAt: log.createdAt,
            };
          }),
          createdAt: exercise.createdAt,
          updatedAt: exercise.updatedAt,
        });
      }),
    );

    return Maybe.some({
      data: mappedExercises,
      meta: {
        page,
        perPage: limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  }
}
