import { SessionEntity } from '@root/domain/enterprise/entities/session.entity';

export class SessionViewModel {
  static toHttp(data: SessionEntity) {
    return {
      id: data.id.toValue(),
      startTime: data.startTime,
      endTime: data.endTime,
    };
  }
}
