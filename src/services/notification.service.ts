import { getNotificationRepository } from '@/providers/container.server';
import type { Notification, NotificationType, SessionUser } from '@/types';
import { AppError } from '@/lib/errors';

export class NotificationService {
  private readonly notifications = getNotificationRepository();

  async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    propertyId?: string,
  ): Promise<Notification> {
    return this.notifications.create({
      userId,
      type,
      title,
      message,
      propertyId,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  async listForUser(actor: SessionUser): Promise<Notification[]> {
    return this.notifications.listByUser(actor.id);
  }

  async unreadCount(actor: SessionUser): Promise<number> {
    return this.notifications.countUnread(actor.id);
  }

  async markRead(actor: SessionUser, notificationId: string): Promise<void> {
    await this.notifications.markRead(actor.id, notificationId);
  }

  async markAllRead(actor: SessionUser): Promise<void> {
    await this.notifications.markAllRead(actor.id);
  }

  async listForSeller(actor: SessionUser): Promise<Notification[]> {
    if (actor.role !== 'seller' && actor.role !== 'admin') {
      throw new AppError('Forbidden', 'FORBIDDEN', 403);
    }
    return this.notifications.listByUser(actor.id);
  }
}

export const notificationService = new NotificationService();
