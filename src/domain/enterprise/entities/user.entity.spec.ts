import { UniqueEntityId } from 'src/core/domain/entity/unique-id.entity';

import { UserRole } from '../types/user';
import { UserEntity } from './user.entity';

describe('User - Entity', () => {
  it('shoud be create and validate all props of User Entity', () => {
    const user = UserEntity.create(
      {
        name: 'John Doe',
        email: 'testemail@gmail.com',
        password: 'password',
        role: UserRole.USER,
      },
      new UniqueEntityId(),
    );

    expect(user).toBeInstanceOf(UserEntity);
    expect(user.id).toBe('John Doe');
    expect(user.email).toBe('testemail@gmail.com');
    expect(user.role).toBeInstanceOf(UserRole);
    expect(user.password).toBe('password');
    expect(user.createdAt).toBeInstanceOf(Date);
    expect(user.updatedAt).toBeInstanceOf(Date);
  });
});
