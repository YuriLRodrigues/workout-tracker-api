import { UserPayload } from '@root/infra/auth/auth-user';

export abstract class Encrypter {
  abstract encrypt(payload: UserPayload): Promise<string>;
}
