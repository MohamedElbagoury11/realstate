import { COLLECTIONS } from '@/lib/constants';
import { getAdminFirestore } from '@/providers/firebase/admin';
import type { NotificationRepository } from '@/repositories/interfaces/notification.repository';
import type { Notification } from '@/types';
import { randomUUID } from 'crypto';

export class FirebaseNotificationRepository implements NotificationRepository {
  private collection() {
    return getAdminFirestore().collection(COLLECTIONS.notifications);
  }

  async create(data: Omit<Notification, 'id'>): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { id, ...data };
    await this.collection().doc(id).set(notification);
    return notification;
  }

  async listByUser(userId: string, limit = 50): Promise<Notification[]> {
    const snap = await this.collection()
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Notification);
  }

  async markRead(userId: string, notificationId: string): Promise<void> {
    const ref = this.collection().doc(notificationId);
    const snap = await ref.get();
    if (!snap.exists || snap.data()?.userId !== userId) return;
    await ref.update({ read: true });
  }

  async markAllRead(userId: string): Promise<void> {
    const snap = await this.collection().where('userId', '==', userId).where('read', '==', false).get();
    const batch = getAdminFirestore().batch();
    snap.docs.forEach((d) => batch.update(d.ref, { read: true }));
    if (!snap.empty) await batch.commit();
  }

  async countUnread(userId: string): Promise<number> {
    const agg = await this.collection()
      .where('userId', '==', userId)
      .where('read', '==', false)
      .count()
      .get();
    return agg.data().count;
  }
}
