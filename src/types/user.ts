export type UserRole = 'admin' | 'seller' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  approved: boolean;
  rejected: boolean;
  createdAt: string;
}

export type CreateUserInput = Omit<User, 'id' | 'createdAt' | 'approved' | 'rejected'> & {
  approved?: boolean;
  rejected?: boolean;
};

export type UpdateUserInput = Partial<
  Pick<User, 'name' | 'phone' | 'role' | 'approved' | 'rejected'>
>;
