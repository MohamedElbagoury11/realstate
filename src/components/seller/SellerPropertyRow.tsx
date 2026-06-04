'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTransition } from 'react';
import type { Property } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { deletePropertyAction } from '@/actions/property.actions';

export function SellerPropertyRow({ property }: { property: Property }) {
  const [pending, startTransition] = useTransition();
  const tCommon = useTranslations('common');

  return (
    <li className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-white p-4">
      <div>
        <p className="font-medium">{property.title}</p>
        <p className="text-sm text-zinc-600">
          ${property.price.toLocaleString()} · {property.city}
        </p>
        <Badge status={property.status} className="mt-2" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Link
          href={`/seller/dashboard/properties/${property.id}/edit`}
          className="inline-flex items-center rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50"
        >
          {tCommon('edit')}
        </Link>
        <Button
          variant="danger"
          disabled={pending}
          onClick={() => startTransition(() => deletePropertyAction(property.id))}
        >
          {tCommon('delete')}
        </Button>
      </div>
    </li>
  );
}
