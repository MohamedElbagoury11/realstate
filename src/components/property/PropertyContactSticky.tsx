'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Phone, MessageCircle } from 'lucide-react';
import { trackLeadAction } from '@/actions/lead.actions';
import type { PlatformSettings } from '@/types';

function digitsOnly(value: string): string {
  return value.replace(/\D/g, '');
}

export function PropertyContactSticky({
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
      const text = encodeURIComponent(t('contact.whatsappPrefillShort'));
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
    <>
      {/* Desktop inline — rendered separately on page */}
      <div className="hidden md:block" />
      {/* Mobile sticky bar */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--border)] bg-[var(--surface)]/95 p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur-md md:hidden"
        role="region"
        aria-label={t('contact.stickyAria')}
      >
        <p className="mb-2 text-center text-xs text-[var(--muted)]">{t('contact.stickyLabel')}</p>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={pending || !whatsapp}
            onClick={onWhatsApp}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <MessageCircle className="h-5 w-5" />
            {t('contact.whatsapp')}
          </button>
          <button
            type="button"
            disabled={pending || !phone}
            onClick={onCall}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[var(--brand)] py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            <Phone className="h-5 w-5" />
            {t('contact.call')}
          </button>
        </div>
      </div>
      <div className="h-24 md:hidden" aria-hidden />
    </>
  );
}
