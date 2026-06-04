'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import {
  createSettingsFormSchema,
  type SettingsFormInput,
} from '@/lib/validation/i18n-schemas';
import { getServerErrorKey } from '@/lib/server-error-i18n';
import { updatePlatformSettingsAction } from '@/actions/settings.actions';
import type { PlatformSettings } from '@/types';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function AdminSettingsForm({ settings }: { settings: PlatformSettings }) {
  const [message, setMessage] = useState<string | null>(null);
  const [messageKind, setMessageKind] = useState<'success' | 'error' | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const tv = useTranslations('validation');
  const t = useTranslations('admin');
  const tErrors = useTranslations('errors');
  const schema = useMemo(() => createSettingsFormSchema((k) => tv(k)), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      contactPhone: settings.contactPhone,
      whatsappNumber: settings.whatsappNumber,
      contactEmail: settings.contactEmail,
      socialLinks: settings.socialLinks,
    },
  });

  async function onSubmit(data: SettingsFormInput) {
    setSubmitting(true);
    setMessage(null);
    setMessageKind(null);
    try {
      await updatePlatformSettingsAction(data);
      setMessage(t('settings.saved'));
      setMessageKind('success');
    } catch (error) {
      const key = getServerErrorKey(error);
      const errorKey = key === 'savePropertyFailed' ? 'saveSettingsFailed' : key;
      setMessage(tErrors(`server.${errorKey}`));
      setMessageKind('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-lg space-y-4 rounded-xl border border-zinc-200 bg-white p-6"
    >
      <Input
        label={t('settings.contactPhone')}
        error={errors.contactPhone?.message}
        {...register('contactPhone')}
      />
      <Input
        label={t('settings.whatsapp')}
        error={errors.whatsappNumber?.message}
        {...register('whatsappNumber')}
      />
      <Input
        label={t('settings.contactEmail')}
        type="email"
        error={errors.contactEmail?.message}
        {...register('contactEmail')}
      />
      <p className="text-xs text-zinc-500">{t('settings.socialNote')}</p>
      {message && (
        <p className={`text-sm ${messageKind === 'success' ? 'text-zinc-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <Button type="submit" disabled={submitting}>
        {submitting ? <Spinner className="h-5 w-5" /> : t('settings.save')}
      </Button>
    </form>
  );
}
