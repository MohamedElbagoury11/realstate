import type { UserRole } from './user';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  approved: boolean;
}
