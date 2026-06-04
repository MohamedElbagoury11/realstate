'use client';

import { useTranslations } from 'next-intl';
import { updatePropertyAction } from '@/actions/property.actions';
import { PropertyForm } from '@/components/property/PropertyForm';
import type { Property } from '@/types';
import type { PropertyFormInput } from '@/lib/validation/i18n-schemas';

export function EditPropertyForm({ property }: { property: Property }) {
  const t = useTranslations('property');

  return (
    <PropertyForm
      title={t('form.edit')}
      submitLabel={t('form.saveChanges')}
      initial={property}
      onSubmit={async (data: PropertyFormInput, imageUrls) => {
        await updatePropertyAction(property.id, data, imageUrls);
      }}
    />
  );
}
