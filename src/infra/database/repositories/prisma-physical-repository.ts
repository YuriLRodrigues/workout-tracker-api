import { Injectable } from '@nestjs/common';
import {
  FindUserPhysicalStatsProps,
  PhysicalRepository,
} from '@root/domain/application/repositories/physical.repository';
import { PhysicalEntity } from '@root/domain/enterprise/entities/physical.entity';
import { AsyncMaybe, Maybe } from 'src/core/logic/Maybe';
import { CreateProps, UpdateProps } from 'src/domain/application/repositories/physical.repository';

import { PhysicalMapper } from '../mappers/physical.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaPhysicalRepository implements PhysicalRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ physical }: CreateProps): AsyncMaybe<PhysicalEntity> {
    const raw = PhysicalMapper.toPersistence(physical);

    await this.prismaService.physicalStats.create({ data: raw });

    return Maybe.some(physical);
  }

  async update({ physical }: UpdateProps): AsyncMaybe<void> {
    const raw = PhysicalMapper.toPersistence(physical);

    await this.prismaService.physicalStats.update({
      where: {
        id: physical.id.toValue(),
      },
      data: raw,
    });

    return Maybe.some(null);
  }

  async findUserPhysicalStats({ userId }: FindUserPhysicalStatsProps): AsyncMaybe<PhysicalEntity | null> {
    const PhysicalStats = await this.prismaService.physicalStats.findUnique({
      where: {
        userId: userId.toValue(),
      },
    });

    if (!PhysicalStats) return Maybe.none();

    const mappedPhysicalStats = PhysicalMapper.toDomain(PhysicalStats);

    return Maybe.some(mappedPhysicalStats);
  }
}
