'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import type { User } from '@/types';
import { Button } from '@/components/ui/Button';
import { approveSellerAction, rejectSellerAction } from '@/actions/user.actions';

export function SellerApproval({ sellers }: { sellers: User[] }) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('admin');

  if (!sellers.length) {
    return <p className="text-sm text-zinc-600">{t('users.empty')}</p>;
  }

  return (
    <div className="space-y-3">
      {sellers.map((s) => (
        <div
          key={s.id}
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
        >
          <div>
            <p className="font-medium">{s.name}</p>
            <p className="text-sm text-zinc-600">{s.email}</p>
          </div>
          <div className="flex gap-2">
            <Button
              disabled={pending}
              onClick={() => startTransition(() => approveSellerAction(s.id))}
            >
              {t('users.approve')}
            </Button>
            <Button
              variant="secondary"
              disabled={pending}
              onClick={() => startTransition(() => rejectSellerAction(s.id))}
            >
              {t('users.reject')}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
