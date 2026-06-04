'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import type { Notification } from '@/types';
import {
  getNotificationTitleKey,
  getNotificationMessageKey,
  notificationTitleParams,
} from '@/lib/notification-i18n';
import {
  markAllNotificationsReadAction,
  markNotificationReadAction,
} from '@/actions/notification.actions';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export function SellerNotifications({ notifications }: { notifications: Notification[] }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('seller');
  const tNotif = useTranslations('seller.notifications');
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold">{t('notifications.title')}</h2>
        {unread > 0 && (
          <Button
            variant="ghost"
            disabled={pending}
            onClick={() => startTransition(() => markAllNotificationsReadAction())}
          >
            {t('notifications.markAllRead')}
          </Button>
        )}
      </div>
      <ul className="mt-4 max-h-64 space-y-2 overflow-y-auto">
        {notifications.length === 0 ? (
          <li className="text-sm text-[var(--muted)]">{t('notifications.empty')}</li>
        ) : (
          notifications.slice(0, 20).map((n) => {
            const params = notificationTitleParams(n);
            return (
              <li
                key={n.id}
                className={`rounded-lg border px-3 py-2 text-sm ${
                  n.read
                    ? 'border-[var(--border)] bg-transparent'
                    : 'border-teal-200 bg-teal-50/50'
                }`}
              >
                <p className="font-medium">
                  {tNotif(getNotificationTitleKey(n.type), params)}
                </p>
                <p className="text-[var(--muted)]">
                  {tNotif(getNotificationMessageKey(n.type), params)}
                </p>
                <p className="mt-1 text-xs text-[var(--muted)]">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
                {!n.read && (
                  <button
                    type="button"
                    className="mt-1 text-xs text-[var(--brand-light)] hover:underline"
                    disabled={pending}
                    onClick={() => startTransition(() => markNotificationReadAction(n.id))}
                  >
                    {t('notifications.markRead')}
                  </button>
                )}
              </li>
            );
          })
        )}
      </ul>
    </Card>
  );
}
