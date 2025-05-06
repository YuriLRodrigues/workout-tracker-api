import { compare, hash } from 'bcryptjs';
import { HashGenerator } from 'src/domain/application/cryptography/hash-generator';

export class Bcrypt implements HashGenerator {
  private hashLength: number = 12;

  hash(plain: string): Promise<string> {
    return hash(plain, this.hashLength);
  }
  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
