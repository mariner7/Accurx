import { User } from '../services/AuthService.js';

export interface UserRepository {
  save(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  existsByEmail(email: string): Promise<boolean>;
}
