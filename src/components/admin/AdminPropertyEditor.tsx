'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { updatePropertyAction } from '@/actions/property.actions';
import { PropertyForm } from '@/components/property/PropertyForm';
import { AdminFeaturedFields } from '@/components/admin/AdminFeaturedFields';
import type { PropertyWithSeller } from '@/types';
import type { PropertyFormInput } from '@/lib/validation/i18n-schemas';

export function AdminPropertyEditor({ property: initial }: { property: PropertyWithSeller }) {
  const [property, setProperty] = useState(initial);
  const tEditor = useTranslations('admin');

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <PropertyForm
          title={tEditor('editor.title')}
          submitLabel={tEditor('editor.save')}
          initial={property}
          onSubmit={async (data: PropertyFormInput, imageUrls) => {
            await updatePropertyAction(property.id, data, imageUrls, {
              featured: property.featured,
              featuredUntil: property.featuredUntil,
              featuredPriority: property.featuredPriority,
            });
          }}
        />
      </div>
      <aside className="space-y-6">
        <AdminFeaturedFields property={property} onChange={(f) => setProperty((p) => ({ ...p, ...f }))} />
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6 text-sm">
          <h2 className="font-semibold text-amber-900">{tEditor('editor.sellerPanel')}</h2>
          <dl className="mt-4 space-y-2">
            <div>
              <dt className="text-amber-800/80">{tEditor('editor.name')}</dt>
              <dd className="font-medium">{property.seller.name}</dd>
            </div>
            <div>
              <dt className="text-amber-800/80">{tEditor('editor.email')}</dt>
              <dd>{property.seller.email}</dd>
            </div>
            <div>
              <dt className="text-amber-800/80">{tEditor('editor.phone')}</dt>
              <dd>{property.seller.phone ?? '—'}</dd>
            </div>
            <div>
              <dt className="text-amber-800/80">{tEditor('editor.registered')}</dt>
              <dd>{new Date(property.seller.createdAt).toLocaleDateString()}</dd>
            </div>
            <div>
              <dt className="text-amber-800/80">{tEditor('editor.account')}</dt>
              <dd>
                {property.seller.approved
                  ? tEditor('editor.approvedSeller')
                  : tEditor('editor.pendingApproval')}
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}
