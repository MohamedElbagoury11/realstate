import type { CreateUserInput, UpdateUserInput, User } from '@/types';

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  getAll(): Promise<User[]>;
  getByRole(role: User['role']): Promise<User[]>;
  create(id: string, data: CreateUserInput): Promise<void>;
  update(id: string, data: UpdateUserInput): Promise<void>;
  delete(id: string): Promise<void>;
}
