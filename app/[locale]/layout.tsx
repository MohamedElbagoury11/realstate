import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { NavigationProgress } from '@/components/ui/NavigationProgress';
import { routing, isRtlLocale } from '@/i18n/routing';
import { getRootMetadata } from '@/lib/metadata-i18n';
import '../globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return getRootMetadata(locale);
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtlLocale(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <NavigationProgress />
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
