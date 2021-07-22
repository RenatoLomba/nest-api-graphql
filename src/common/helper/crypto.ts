import { hashSync } from 'bcrypt';

export class HashPasswordTransform {
  to(password: string): string {
    return hashSync(password, 10);
  }
  from(hash: string): string {
    return hash;
  }
}
