import { AppError } from '@/lib/errors';
import type { SessionUser, User, UserRole } from '@/types';
import { getUserRepository } from '@/providers/container.server';

export class UserService {
  private readonly users = getUserRepository();

  async getAll(): Promise<User[]> {
    return this.users.getAll();
  }

  async getSellersPendingApproval(): Promise<User[]> {
    const sellers = await this.users.getByRole('seller');
    return sellers.filter((u) => !u.approved && !u.rejected);
  }

  async approveSeller(actor: SessionUser, userId: string): Promise<void> {
    this.assertAdmin(actor);
    const user = await this.users.getById(userId);
    if (!user || user.role !== 'seller') {
      throw new AppError('Seller not found', 'SELLER_NOT_FOUND', 404);
    }
    await this.users.update(userId, { approved: true, rejected: false });
  }

  async rejectSeller(actor: SessionUser, userId: string): Promise<void> {
    this.assertAdmin(actor);
    const user = await this.users.getById(userId);
    if (!user || user.role !== 'seller') {
      throw new AppError('Seller not found', 'SELLER_NOT_FOUND', 404);
    }
    await this.users.update(userId, { approved: false, rejected: true });
  }

  async deleteUser(actor: SessionUser, userId: string): Promise<void> {
    this.assertAdmin(actor);
    await this.users.delete(userId);
  }

  private assertAdmin(actor: SessionUser): void {
    if (actor.role !== 'admin') {
      throw new AppError('Admin access required', 'FORBIDDEN', 403);
    }
  }
}

export const userService = new UserService();

export function canAccessAdmin(role: UserRole): boolean {
  return role === 'admin';
}

export function canAccessSeller(role: UserRole): boolean {
  return role === 'seller' || role === 'admin';
}
