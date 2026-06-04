'use server';

import { getServerSession } from '@/lib/auth-server';
import { notificationService } from '@/services/notification.service';
import { revalidatePath } from 'next/cache';

export async function getNotificationsAction() {
  const session = await getServerSession();
  if (!session) return [];
  return notificationService.listForUser(session);
}

export async function getUnreadNotificationCountAction() {
  const session = await getServerSession();
  if (!session) return 0;
  return notificationService.unreadCount(session);
}

export async function markNotificationReadAction(notificationId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await notificationService.markRead(session, notificationId);
  revalidatePath('/seller/dashboard');
}

export async function markAllNotificationsReadAction() {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await notificationService.markAllRead(session);
  revalidatePath('/seller/dashboard');
}
