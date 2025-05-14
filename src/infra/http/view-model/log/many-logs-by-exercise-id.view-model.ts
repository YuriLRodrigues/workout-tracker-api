import { Logs } from '@root/domain/enterprise/value-object/logs';

export class ManyLogsByExerciseIdViewModel {
  static toHttp(data: Logs) {
    return {
      id: data.id.toValue(),
      maxSeries: data.maxSeries,
      maxWeight: data.maxWeight,
      maxRepeat: data.maxRepeat,
      exerciseExecutionType: data.exerciseExecutionType,
      averageRestTime: data.averageRestTime,
      effortLevel: data.effortLevel,
      notes: data.notes || undefined,
      sessionId: data.sessionId ? data.sessionId.toValue() : undefined,
      exerciseId: data.exerciseId.toValue(),
      userId: data.userId.toValue(),
      createdAt: data.createdAt,
    };
  }
}
