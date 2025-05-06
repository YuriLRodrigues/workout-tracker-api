import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from 'src/core/logic/Maybe';
import { ImageEntity } from 'src/domain/enterprise/entities/image.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type CreateProps = {
  image: ImageEntity;
};

export type DeleteProps = {
  imageId: UniqueEntityId;
};

export type FindUserAvatarProps = {
  userId: UniqueEntityId;
};

export abstract class ImageRepository {
  abstract create({ image }: CreateProps): AsyncMaybe<ImageEntity>;
  abstract delete({ imageId }: DeleteProps): AsyncMaybe<void>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<ImageEntity | null>;
  abstract findUserAvatar({ userId }: FindUserAvatarProps): AsyncMaybe<ImageEntity | null>;
  abstract update({ image }: CreateProps): AsyncMaybe<ImageEntity>;
}
