'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTransition } from 'react';
import type { Property, PropertyStatus } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  deletePropertyAction,
  hidePropertyAction,
  restorePropertyAction,
  updatePropertyStatusAction,
} from '@/actions/property.actions';

export function PropertyModeration({
  properties,
  currentStatus,
}: {
  properties: Property[];
  currentStatus?: PropertyStatus;
}) {
  const [pending, startTransition] = useTransition();
  const tAdmin = useTranslations('admin');
  const tStatus = useTranslations('common');

  const tabs: { status?: PropertyStatus; labelKey: 'all' | PropertyStatus }[] = [
    { labelKey: 'all' },
    { status: 'pending', labelKey: 'pending' },
    { status: 'approved', labelKey: 'approved' },
    { status: 'rejected', labelKey: 'rejected' },
    { status: 'hidden', labelKey: 'hidden' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 border-b border-zinc-200 pb-3">
        {tabs.map((tab) => {
          const href = tab.status
            ? `/admin/properties?status=${tab.status}`
            : '/admin/properties';
          const active =
            (tab.status ?? 'all') === (currentStatus ?? 'all') ||
            (!tab.status && !currentStatus);
          return (
            <Link
              key={tab.labelKey}
              href={href}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                active
                  ? 'bg-emerald-700 text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {tStatus(`status.${tab.labelKey}`)}
            </Link>
          );
        })}
      </div>
      <div className="space-y-4">
        {properties.length === 0 ? (
          <p className="text-sm text-zinc-600">{tAdmin('properties.empty')}</p>
        ) : (
          properties.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div>
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-zinc-600">
                  {p.city} · ${p.price.toLocaleString()} · {p.propertyType}
                </p>
                <Badge status={p.status} className="mt-2" />
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/admin/properties/${p.id}`}
                  className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
                >
                  {tAdmin('properties.viewEdit')}
                </Link>
                {p.status === 'pending' && (
                  <>
                    <Button
                      variant="secondary"
                      disabled={pending}
                      onClick={() =>
                        startTransition(() => updatePropertyStatusAction(p.id, 'approved'))
                      }
                    >
                      {tAdmin('properties.approve')}
                    </Button>
                    <Button
                      variant="ghost"
                      disabled={pending}
                      onClick={() =>
                        startTransition(() => updatePropertyStatusAction(p.id, 'rejected'))
                      }
                    >
                      {tAdmin('properties.reject')}
                    </Button>
                  </>
                )}
                {p.status === 'approved' && (
                  <Button
                    variant="ghost"
                    disabled={pending}
                    onClick={() => startTransition(() => hidePropertyAction(p.id))}
                  >
                    {tAdmin('properties.hide')}
                  </Button>
                )}
                {p.status === 'hidden' && (
                  <Button
                    variant="secondary"
                    disabled={pending}
                    onClick={() => startTransition(() => restorePropertyAction(p.id))}
                  >
                    {tAdmin('properties.restore')}
                  </Button>
                )}
                <Button
                  variant="danger"
                  disabled={pending}
                  onClick={() => startTransition(() => deletePropertyAction(p.id))}
                >
                  {tAdmin('properties.delete')}
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
