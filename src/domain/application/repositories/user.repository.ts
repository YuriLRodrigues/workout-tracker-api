import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { AsyncMaybe } from 'src/core/logic/Maybe';
import { UserEntity } from 'src/domain/enterprise/entities/user.entity';

export type FindByIdProps = {
  id: UniqueEntityId;
};

export type FindByEmailProps = {
  email: string;
};

export type RegisterProps = {
  user: UserEntity;
};

export type SaveProps = {
  user: UserEntity;
};

export type DeleteProps = {
  userId: UniqueEntityId;
};

export type meProps = {
  userId: UniqueEntityId;
};

export abstract class UserRepository {
  abstract me({ userId }: meProps): AsyncMaybe<UserEntity>;
  abstract findById({ id }: FindByIdProps): AsyncMaybe<UserEntity | null>;
  abstract findByEmail({ email }: FindByEmailProps): AsyncMaybe<UserEntity | null>;
  abstract register({ user }: RegisterProps): AsyncMaybe<UserEntity>;
  abstract save({ user }: SaveProps): AsyncMaybe<UserEntity>;
  abstract delete({ userId }: DeleteProps): AsyncMaybe<void>;
}
