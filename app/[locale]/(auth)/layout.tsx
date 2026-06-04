import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function AuthLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'common' });

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-[var(--background)] px-4 py-12">
      <Link href="/" className="mb-8 text-xl font-bold text-[var(--brand)]">
        {t('brand')}
      </Link>
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
        {children}
      </div>
    </div>
  );
}
