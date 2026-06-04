'use client';

import { useMemo, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  createPropertyFormSchema,
  type PropertyFormInput,
} from '@/lib/validation/i18n-schemas';
import { getServerErrorKey } from '@/lib/server-error-i18n';
import { uploadPropertyImages } from '@/lib/upload-property-images';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import type { Property, PropertyType } from '@/types';

const PROPERTY_TYPES: PropertyType[] = [
  'apartment',
  'house',
  'villa',
  'land',
  'commercial',
  'other',
];

type Props = {
  title: string;
  submitLabel: string;
  initial?: Property;
  onSubmit: (data: PropertyFormInput, imageUrls: string[]) => Promise<void>;
};

export function PropertyForm({ title, submitLabel, initial, onSubmit }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<'success' | 'error' | null>(null);
  const [keepImages] = useState<string[]>(initial?.images ?? []);
  const [amenitiesText, setAmenitiesText] = useState(initial?.amenities.join(', ') ?? '');

  const tv = useTranslations('validation');
  const tForm = useTranslations('property');
  const tErrors = useTranslations('errors');
  const schema = useMemo(() => createPropertyFormSchema((k) => tv(k)), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initial
      ? {
          title: initial.title,
          description: initial.description,
          price: initial.price,
          area: initial.area,
          rooms: initial.rooms,
          bathrooms: initial.bathrooms,
          propertyType: initial.propertyType,
          city: initial.city,
          zone: initial.zone,
          address: initial.address,
          amenities: initial.amenities,
          specifications: initial.specifications,
          metadata: initial.metadata,
        }
      : { propertyType: 'other', amenities: [], specifications: {}, metadata: {} },
  });

  async function handleFormSubmit(data: PropertyFormInput) {
    const input = formRef.current?.querySelector<HTMLInputElement>('input[type="file"]');
    const files = input?.files;
    setSubmitting(true);
    setMessage(null);
    setMessageKind(null);
    try {
      let imageUrls = keepImages;
      if (files?.length) {
        const uploaded = await uploadPropertyImages(Array.from(files));
        imageUrls = [...keepImages, ...uploaded];
      }
      if (!imageUrls.length) {
        setMessage(tForm('form.addImage'));
        setMessageKind('error');
        setSubmitting(false);
        return;
      }
      const amenities = amenitiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      await onSubmit({ ...data, amenities }, imageUrls);
      if (!initial) {
        if (input) input.value = '';
        reset();
      }
      setMessage(initial ? tForm('form.updated') : tForm('form.submitted'));
      setMessageKind('success');
    } catch (error) {
      const key = getServerErrorKey(error);
      setMessage(tErrors(`server.${key}`));
      setMessageKind('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit(handleFormSubmit)}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
    >
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label={tForm('form.title')} error={errors.title?.message} {...register('title')} />
        <Input
          label={tForm('form.price')}
          type="number"
          error={errors.price?.message}
          {...register('price', { valueAsNumber: true })}
        />
        <label className="flex flex-col gap-1 text-sm sm:col-span-2">
          <span className="font-medium">{tForm('form.propertyType')}</span>
          <select
            className="rounded-lg border border-zinc-300 px-3 py-2"
            {...register('propertyType')}
          >
            {PROPERTY_TYPES.map((type) => (
              <option key={type} value={type}>
                {tForm(`types.${type}`)}
              </option>
            ))}
          </select>
        </label>
        <Input label={tForm('form.city')} error={errors.city?.message} {...register('city')} />
        <Input label={tForm('form.zone')} error={errors.zone?.message} {...register('zone')} />
        <Input
          label={tForm('form.area')}
          type="number"
          error={errors.area?.message}
          {...register('area', { valueAsNumber: true })}
        />
        <Input
          label={tForm('form.rooms')}
          type="number"
          error={errors.rooms?.message}
          {...register('rooms', { valueAsNumber: true })}
        />
        <Input
          label={tForm('form.bathrooms')}
          type="number"
          error={errors.bathrooms?.message}
          {...register('bathrooms', { valueAsNumber: true })}
        />
        <Input
          label={tForm('form.address')}
          error={errors.address?.message}
          {...register('address')}
        />
      </div>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{tForm('form.description')}</span>
        <textarea
          className="min-h-24 rounded-lg border border-zinc-300 px-3 py-2"
          {...register('description')}
        />
        {errors.description && (
          <span className="text-xs text-red-600">{errors.description.message}</span>
        )}
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{tForm('form.amenities')}</span>
        <input
          className="rounded-lg border border-zinc-300 px-3 py-2"
          value={amenitiesText}
          onChange={(e) => setAmenitiesText(e.target.value)}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">
          {tForm('form.images')}
          {initial ? ` ${tForm('form.uploadHint')}` : ''}
        </span>
        {initial && keepImages.length > 0 && (
          <p className="text-xs text-zinc-500">
            {tForm('form.existingImages', { count: keepImages.length })}
          </p>
        )}
        <input type="file" accept="image/jpeg,image/png,image/webp" multiple />
      </label>
      {message && (
        <p
          className={`text-sm ${messageKind === 'success' ? 'text-zinc-600' : 'text-red-600'}`}
        >
          {message}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? <Spinner className="h-5 w-5" /> : submitLabel}
      </Button>
    </form>
  );
}
