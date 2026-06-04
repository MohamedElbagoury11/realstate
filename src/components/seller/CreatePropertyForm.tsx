'use client';

import { useTranslations } from 'next-intl';
import { createPropertyAction } from '@/actions/property.actions';
import { PropertyForm } from '@/components/property/PropertyForm';
import type { PropertyFormInput } from '@/lib/validation/i18n-schemas';

export function CreatePropertyForm() {
  const t = useTranslations('property');

  return (
    <PropertyForm
      title={t('form.listNew')}
      submitLabel={t('form.submitListing')}
      onSubmit={async (data: PropertyFormInput, imageUrls) => {
        await createPropertyAction(data, imageUrls);
      }}
    />
  );
}
