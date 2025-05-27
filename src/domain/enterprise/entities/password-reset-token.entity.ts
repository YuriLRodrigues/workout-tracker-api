import { Entity } from '@root/core/domain/entity/entity';
import { UniqueEntityId } from '@root/core/domain/entity/unique-id.entity';
import { Optional } from '@root/core/logic/Optional';
import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';

export type PasswordResetTokenProps = {
  email: string;
  token: UniqueEntityId;
  createdAt: Date;
  updatedAt?: Date;
};

export class PasswordResetToken extends Entity<PasswordResetTokenProps> {
  get email() {
    return this.props.email;
  }

  get token() {
    return this.props.token;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt || getBrasilUTCDate();
  }

  static create(props: Optional<PasswordResetTokenProps, 'createdAt' | 'token'>, id?: UniqueEntityId) {
    const passwordResetToken = new PasswordResetToken(
      {
        email: props.email,
        token: props.token || new UniqueEntityId(),
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: props.updatedAt || getBrasilUTCDate(),
      },
      id,
    );

    return passwordResetToken;
  }
}
