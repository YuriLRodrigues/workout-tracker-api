import { Injectable } from '@nestjs/common';
import { AsyncMaybe, Maybe } from 'src/core/logic/Maybe';
import {
  CreateProps,
  DeleteProps,
  FindByIdProps,
  FindUserAvatarProps,
  ImageRepository,
} from 'src/domain/application/repositories/image.repository';
import { ImageEntity } from 'src/domain/enterprise/entities/image.entity';

import { ImageMapper } from '../mappers/image.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaImageRepository implements ImageRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    const raw = ImageMapper.toPersistence(image);

    await this.prismaService.image.create({ data: raw });

    return Maybe.some(image);
  }

  async delete({ imageId }: DeleteProps): AsyncMaybe<void> {
    await this.prismaService.image.delete({
      where: {
        id: imageId.toValue(),
      },
    });

    return Maybe.none();
  }

  async findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity | null> {
    const image = await this.prismaService.image.findUnique({
      where: {
        id: id.toValue(),
      },
    });

    if (!image) {
      return Maybe.none();
    }

    const mappedImage = ImageMapper.toDomain(image);

    return Maybe.some(mappedImage);
  }

  async findUserAvatar({ userId }: FindUserAvatarProps): AsyncMaybe<ImageEntity | null> {
    const image = await this.prismaService.image.findFirst({
      where: {
        userId: userId.toValue(),
        type: 'AVATAR',
      },
    });

    if (!image) {
      return Maybe.none();
    }

    const mappedImage = ImageMapper.toDomain(image);

    return Maybe.some(mappedImage);
  }

  async update({ image }: CreateProps): AsyncMaybe<ImageEntity> {
    const raw = ImageMapper.toPersistence(image);

    const updatedImage = await this.prismaService.image.update({
      where: {
        id: image.id.toValue(),
      },
      data: raw,
    });

    const mappedImage = ImageMapper.toDomain(updatedImage);

    return Maybe.some(mappedImage);
  }
}
