import type { Notification } from '@/types';

export interface NotificationRepository {
  create(data: Omit<Notification, 'id'>): Promise<Notification>;
  listByUser(userId: string, limit?: number): Promise<Notification[]>;
  markRead(userId: string, notificationId: string): Promise<void>;
  markAllRead(userId: string): Promise<void>;
  countUnread(userId: string): Promise<number>;
}
