import { PhysicalEntity } from '@root/domain/enterprise/entities/physical.entity';

export class PhysicalViewModel {
  static toHttp(data: PhysicalEntity) {
    return {
      height: data.height,
      weight: data.weight,
      age: data.age,
      bodyFat: data.bodyFat ?? undefined,
      muscleMass: data.muscleMass ?? undefined,
      goal: data.goal,
      userId: data.userId.toValue(),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt ?? undefined,
    };
  }
}
