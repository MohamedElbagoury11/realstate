'use client';

import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { createRegisterSchema, type RegisterInput } from '@/lib/validation/i18n-schemas';
import { getAuthErrorKey } from '@/lib/auth-errors';
import { useAuth } from '@/hooks/useAuth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';

export function RegisterForm() {
  const { register: signUp } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const tv = useTranslations('validation');
  const tAuth = useTranslations('auth');
  const tErrors = useTranslations('errors');
  const schema = useMemo(() => createRegisterSchema((k) => tv(k)), [tv]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<RegisterInput>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'customer' },
  });

  async function onSubmit(data: RegisterInput) {
    setSubmitting(true);
    try {
      await signUp(data);
    } catch (error) {
      setError('root', { message: tErrors(getAuthErrorKey(error)) });
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-md space-y-4">
      <Input label={tAuth('register.name')} error={errors.name?.message} {...register('name')} />
      <Input
        label={tAuth('register.email')}
        type="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <Input label={tAuth('register.phone')} error={errors.phone?.message} {...register('phone')} />
      <Input
        label={tAuth('register.password')}
        type="password"
        error={errors.password?.message}
        {...register('password')}
      />
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">{tAuth('register.accountType')}</span>
        <select className="rounded-lg border border-zinc-300 px-3 py-2" {...register('role')}>
          <option value="customer">{tAuth('register.roleCustomer')}</option>
          <option value="seller">{tAuth('register.roleSeller')}</option>
        </select>
      </label>
      {errors.root && <p className="text-sm text-red-600">{errors.root.message}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? <Spinner className="h-5 w-5" /> : tAuth('register.submit')}
      </Button>
    </form>
  );
}
