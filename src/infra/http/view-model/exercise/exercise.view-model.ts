import { Exercise } from 'src/domain/enterprise/value-object/exercise';

export class ExerciseViewModel {
  static toHttp(data: Exercise) {
    return {
      id: data.id.toValue(),
      userId: data.userId.toValue(),
      workoutId: data.workoutId.toValue(),
      name: data.name,
      description: data.description,
      muscleType: data.muscleType,
      executionType: data.executionType,
      targetSets: data.targetSets,
      targetResTime: data.targetResTime,
      targetRepetitions: data.targetRepetitions,
      maxWeight: data.maxWeight,
      lastWeight: data.lastWeight,
      videoReference: data.videoReference || undefined,
      logs: data.logs.map((log) => ({
        id: log.id.toValue(),
        maxRepeat: log.maxRepeat,
        maxSeries: log.maxSeries,
        averageRestTime: log.averageRestTime,
        notes: log.notes,
        createdAt: log.createdAt,
      })),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt || undefined,
    };
  }
}
