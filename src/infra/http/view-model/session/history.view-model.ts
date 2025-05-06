import { History } from '@root/domain/enterprise/value-object/history';

export class HistoryViewModel {
  static toHttp(data: History) {
    return {
      id: data.id.toValue(),
      startTime: data.startTime,
      endTime: data.endTime,
      color: data.color,
      icon: data.icon,
      workoutName: data.workoutName,
      workoutDescription: data.workoutDescription,
      workoutId: data.workoutId.toValue(),
    };
  }
}
