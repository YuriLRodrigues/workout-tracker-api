import { LogEntity } from '@root/domain/enterprise/entities/log.entity';

export class LogViewModel {
  static toHttp(data: LogEntity) {
    return {
      id: data.id.toValue(),
      maxSeries: data.maxSeries,
      maxWeight: data.maxWeight,
      maxRepeat: data.maxRepeat,
      averageRestTime: data.averageRestTime,
      notes: data.notes || undefined,
      sessionId: data.sessionId ? data.sessionId.toValue() : undefined,
      exerciseId: data.exerciseId.toValue(),
      userId: data.userId.toValue(),
      createdAt: data.createdAt,
    };
  }
}
