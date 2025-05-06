import { getBrasilUTCDate } from '@root/utils/get-brasil-utc-date';
import { Entity } from 'src/core/domain/entity/entity';
import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';
import { Optional } from 'src/core/logic/Optional';

import { UserGender, UserRole } from '../types/user';

export type UserEntityProps = {
  name: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  birthDate?: Date;
  gender?: UserGender;
  role: UserRole;
  disabled?: Date;
  createdAt: Date;
  updatedAt?: Date;
};

type UpdateUserPersonalInfoProps = {
  name?: string;
  lastName?: string;
  phone?: string;
  birthDate?: Date;
  gender?: UserGender;
};

export class UserEntity extends Entity<UserEntityProps> {
  get name() {
    return this.props.name;
  }

  set name(name: string) {
    this.props.name = name;
  }

  get lastName() {
    return this.props.lastName;
  }

  set lastName(lastName: string) {
    this.props.lastName = lastName;
  }

  get email() {
    return this.props.email;
  }

  get password() {
    return this.props.password;
  }

  get phone() {
    return this.props.phone;
  }

  set phone(phone: string) {
    this.props.phone = phone;
  }

  get birthDate() {
    return this.props.birthDate;
  }

  set birthDate(birthDate: Date) {
    this.props.birthDate = birthDate;
  }

  get gender() {
    return this.props.gender;
  }

  set gender(gender: UserGender) {
    this.props.gender = gender;
  }

  get role() {
    return this.props.role;
  }

  get disabled() {
    return this.props.disabled;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  private touch() {
    this.props.updatedAt = getBrasilUTCDate();
  }

  static create(props: Optional<UserEntityProps, 'createdAt'>, id?: UniqueEntityId) {
    return new UserEntity(
      {
        name: props.name,
        lastName: props.lastName,
        email: props.email,
        disabled: props.disabled,
        birthDate: props.birthDate,
        gender: props.gender,
        phone: props.phone,
        password: props.password,
        role: props.role || UserRole.USER,
        createdAt: props.createdAt || getBrasilUTCDate(),
        updatedAt: getBrasilUTCDate(),
      },
      id,
    );
  }

  public updatePersonalInfo(props: UpdateUserPersonalInfoProps) {
    this.birthDate = props.birthDate ?? this.props.birthDate;
    this.gender = props.gender ?? this.props.gender;
    this.lastName = props.lastName ?? this.props.lastName;
    this.phone = props.phone ?? this.props.phone;
    this.name = props.name ?? this.props.name;
    this.touch();

    return this;
  }
}
