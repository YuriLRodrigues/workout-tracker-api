import { Me } from 'src/domain/enterprise/value-object/me';

export class MeViewModel {
  static toHttp(data: Me) {
    return {
      id: data.id.toValue(),
      blurHash: data.blurHash,
      avatar: data.avatar,
      email: data.email,
      name: data.name,
      lastName: data.lastName,
      role: data.role,
      phone: data.phone,
      birthDate: data.birthDate,
      gender: data.gender,
      createdAt: data.createdAt,
    };
  }
}
