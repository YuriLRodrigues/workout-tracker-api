import { Exercise, Prisma, ExecutionType as PrismaExecutionType, MuscleType as PrismaMuscleType } from '@prisma/client';
import { ExecutionType, MuscleType } from '@root/domain/enterprise/types/exercise';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ExerciseEntity } from 'src/domain/enterprise/entities/exercise.entity';

export class ExerciseMapper {
  static toPersistence(data: ExerciseEntity): Prisma.ExerciseCreateInput {
    return {
      id: data.id.toValue(),
      name: data.name,
      description: data.description,
      executionType: data.executionType as PrismaExecutionType,
      muscleType: data.muscleType as PrismaMuscleType,
      targetRepetitions: data.targetRepetitions,
      targetResTime: data.targetResTime,
      targetSets: data.targetSets,
      workout: {
        connect: {
          id: data.workoutId.toValue(),
        },
      },
      user: {
        connect: {
          id: data.userId.toValue(),
        },
      },
      videoReference: data.videoReference ? data.videoReference : undefined,
      banner: data.bannerId
        ? {
            connect: {
              id: data.bannerId.toValue(),
            },
          }
        : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  static toDomain(data: Exercise): ExerciseEntity {
    return ExerciseEntity.create(
      {
        description: data.description,
        executionType: data.executionType as ExecutionType,
        muscleType: data.muscleType as MuscleType,
        targetRepetitions: data.targetRepetitions,
        targetResTime: data.targetResTime,
        targetSets: data.targetSets,
        workoutId: new UniqueEntityId(data.workoutId),
        videoReference: data.videoReference,
        userId: new UniqueEntityId(data.userId),
        name: data.name,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }
}
