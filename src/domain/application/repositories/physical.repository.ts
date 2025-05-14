import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from '@root/core/logic/Maybe';
import { PhysicalEntity } from '@root/domain/enterprise/entities/physical.entity';

export type CreateProps = {
  physical: PhysicalEntity;
};

export type UpdateProps = {
  physical: PhysicalEntity;
};

export type FindUserPhysicalStatsProps = {
  userId: UniqueEntityId;
};

export abstract class PhysicalRepository {
  abstract create({ physical }: CreateProps): AsyncMaybe<PhysicalEntity>;
  abstract update({ physical }: UpdateProps): AsyncMaybe<void>;
  abstract findUserPhysicalStats({ userId }: FindUserPhysicalStatsProps): AsyncMaybe<PhysicalEntity | null>;
}
