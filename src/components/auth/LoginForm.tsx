'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createLoginSchema, type LoginInput } from '@/lib/validation/i18n-schemas';
import { getAuthErrorKey } from '@/lib/auth-errors';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function LoginForm() {
  const { login } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const tv = useTranslations('validation');
  const tAuth = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const schema = useMemo(() => createLoginSchema((k) => tv(k)), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginInput>({ resolver: zodResolver(schema) });

  async function onSubmit(data: LoginInput) {
    setSubmitting(true);
    try {
      await login(data);
    } catch (error) {
      setError('root', { message: tErrors(getAuthErrorKey(error)) });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <Input
        label={tAuth('login.email')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input
        label={tAuth('login.password')}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? <Spinner className="h-5 w-5" /> : tAuth('login.submit')}
      </Button>
    </form>
  );
}
