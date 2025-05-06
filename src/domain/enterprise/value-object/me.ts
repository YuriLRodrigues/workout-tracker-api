import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { ValueObject } from 'src/core/domain/value-object/value-object';

import { UserGender, UserRole } from '../types/user';

export type MeProps = {
  id: UniqueEntityId;
  blurHash?: string;
  avatar?: string;
  email: string;
  name: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  birthDate?: Date;
  gender?: UserGender;
  createdAt: Date;
};

export class Me extends ValueObject<MeProps> {
  get id() {
    return this.props.id;
  }

  get avatar() {
    return this.props.avatar;
  }

  get blurHash() {
    return this.props.blurHash;
  }

  get email() {
    return this.props.email;
  }

  get name() {
    return this.props.name;
  }

  get lastName() {
    return this.props.lastName;
  }

  get phone() {
    return this.props.phone;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  get gender() {
    return this.props.gender;
  }

  get role() {
    return this.props.role;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  static create(props: MeProps) {
    return new Me({
      id: props.id,
      role: props.role,
      blurHash: props.blurHash,
      avatar: props.avatar,
      email: props.email,
      name: props.name,
      lastName: props.lastName,
      birthDate: props.birthDate,
      gender: props.gender,
      phone: props.phone,
      createdAt: props.createdAt,
    });
  }
}
