'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { trackLeadAction } from '@/actions/lead.actions';
import type { PlatformSettings } from '@/types';
import { Button } from '@/components/ui/Button';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

/** Desktop contact card — mobile uses PropertyContactSticky */
export function PropertyContactBar({
  propertyId,
  settings,
}: {
  propertyId: string;
  settings: PlatformSettings;
}) {
  const [pending, startTransition] = useTransition();
  const t = useTranslations('public');
  const phone = digitsOnly(settings.contactPhone);
  const whatsapp = digitsOnly(settings.whatsappNumber);

  function onWhatsApp() {
    if (!whatsapp) return;
    startTransition(async () => {
      await trackLeadAction(propertyId, 'whatsapp');
      const text = encodeURIComponent(t('contact.whatsappPrefill'));
      window.open(`https://wa.me/${whatsapp}?text=${text}`, '_blank', 'noopener,noreferrer');
    });
  }

  function onCall() {
    if (!phone) return;
    startTransition(async () => {
      await trackLeadAction(propertyId, 'call');
      window.location.href = `tel:${phone}`;
    });
  }

  return (
    <div className="hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow)] md:block">
      <p className="text-sm text-[var(--muted)]">{t('contact.barCopy')}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button
          type="button"
          disabled={pending || !whatsapp}
          onClick={onWhatsApp}
          className="bg-[#25D366] hover:bg-[#1da851]"
        >
          {t('contact.whatsapp')}
        </Button>
        <Button type="button" variant="secondary" disabled={pending || !phone} onClick={onCall}>
          {t('contact.call')}
        </Button>
        {settings.contactEmail && (
          <a
            href={`mailto:${settings.contactEmail}?subject=${encodeURIComponent(t('contact.emailSubject'))}`}
            className="inline-flex items-center rounded-lg border border-[var(--border)] px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            {t('contact.email')}
          </a>
        )}
      </div>
    </div>
  );
}
