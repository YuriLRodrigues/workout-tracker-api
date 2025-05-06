import { Prisma, Image, ImageType as PrismaImageType } from '@prisma/client';
import { ImageType } from '@root/domain/enterprise/types/image';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ImageEntity } from 'src/domain/enterprise/entities/image.entity';

export class ImageMapper {
  static toPersistence(data: ImageEntity): Prisma.ImageCreateInput {
    return {
      id: data.id.toValue(),
      blurHash: data.blurHash,
      url: data.url,
      uploadUniqueName: data.uploadUniqueName,
      type: PrismaImageType[data.type],
      user: { connect: { id: data.userId.toValue() } },
      workout: data.workoutId ? { connect: { id: data.workoutId.toValue() } } : undefined,
      exercise: data.exerciseId ? { connect: { id: data.exerciseId.toValue() } } : undefined,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
  }

  static toDomain(data: Image): ImageEntity {
    return ImageEntity.create(
      {
        url: data.url,
        blurHash: data.blurHash,
        type: ImageType[data.type],
        uploadUniqueName: data.uploadUniqueName,
        userId: new UniqueEntityId(data.userId),
        exerciseId: data.exerciseId ? new UniqueEntityId(data.exerciseId) : undefined,
        workoutId: data.workoutId ? new UniqueEntityId(data.workoutId) : undefined,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      new UniqueEntityId(data.id),
    );
  }
}
