'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, Flag } from 'lucide-react';
import { reportPropertyAction } from '@/actions/report.actions';
import { getServerErrorKey } from '@/lib/server-error-i18n';
import { Button } from '@/components/ui/Button';
import type { Property } from '@/types';
import type { ReportReason } from '@/types/report';

export function PropertyShareReport({ property }: { property: Property }) {
  const [showReport, setShowReport] = useState(false);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const t = useTranslations('public');
  const tErrors = useTranslations('errors');
  const appUrl = typeof window !== 'undefined' ? window.location.href : '';

  async function onShare() {
    const shareData = {
      title: property.title,
      text: t('share.shareText', { title: property.title }),
      url: appUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* cancelled */
      }
    } else {
      await navigator.clipboard.writeText(appUrl);
      setMessage(t('share.linkCopied'));
    }
  }

  function onReport(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const reason = fd.get('reason') as ReportReason;
    const details = (fd.get('details') as string) || undefined;
    startTransition(async () => {
      try {
        await reportPropertyAction({ propertyId: property.id, reason, details });
        setMessage(t('share.reportSubmitted'));
        setShowReport(false);
      } catch (error) {
        const key = getServerErrorKey(error);
        setMessage(tErrors(`server.${key === 'savePropertyFailed' ? 'submitReportFailed' : key}`));
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button type="button" variant="ghost" onClick={onShare} className="gap-2">
        <Share2 className="h-4 w-4" />
        {t('share.share')}
      </Button>
      <Button type="button" variant="ghost" onClick={() => setShowReport(!showReport)} className="gap-2">
        <Flag className="h-4 w-4" />
        {t('share.report')}
      </Button>
      {message && <span className="text-xs text-[var(--muted)]">{message}</span>}
      {showReport && (
        <form
          onSubmit={onReport}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4"
        >
          <label className="text-sm font-medium">{t('share.reason')}</label>
          <select name="reason" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm" required>
            <option value="spam">{t('share.reasonSpam')}</option>
            <option value="misleading">{t('share.reasonMisleading')}</option>
            <option value="duplicate">{t('share.reasonDuplicate')}</option>
            <option value="other">{t('share.reasonOther')}</option>
          </select>
          <textarea
            name="details"
            placeholder={t('share.detailsPlaceholder')}
            className="mt-2 w-full rounded-lg border px-3 py-2 text-sm"
            rows={2}
          />
          <Button type="submit" className="mt-2" disabled={pending}>
            {t('share.submitReport')}
          </Button>
        </form>
      )}
    </div>
  );
}
