'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck, Eye, MessageCircle } from 'lucide-react';

export function TrustSection() {
  const t = useTranslations('public');

  const items = [
    {
      icon: ShieldCheck,
      titleKey: 'trust.verifiedTitle' as const,
      textKey: 'trust.verifiedDesc' as const,
    },
    {
      icon: MessageCircle,
      titleKey: 'trust.contactTitle' as const,
      textKey: 'trust.contactDesc' as const,
    },
    {
      icon: Eye,
      titleKey: 'trust.analyticsTitle' as const,
      textKey: 'trust.analyticsDesc' as const,
    },
  ];

  return (
    <section className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
      <h2 className="text-center text-2xl font-bold">{t('trust.title')}</h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-3">
        {items.map(({ icon: Icon, titleKey, textKey }) => (
          <div key={titleKey} className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand)]/10 text-[var(--brand)]">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold">{t(titleKey)}</h3>
            <p className="mt-2 text-sm text-[var(--muted)]">{t(textKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
