import type { Notification, NotificationType } from '@/types';

export function extractQuotedTitle(message: string): string {
  const match = message.match(/"([^"]+)"/);
  return match?.[1] ?? message;
}

export function getNotificationTitleKey(type: NotificationType): string {
  return `types.${type}.title`;
}

export function getNotificationMessageKey(type: NotificationType): string {
  return `types.${type}.message`;
}

export function notificationTitleParams(n: Notification): { title: string } {
  return { title: extractQuotedTitle(n.message) };
}
