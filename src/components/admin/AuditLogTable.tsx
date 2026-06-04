'use client';

import { useTranslations } from 'next-intl';
import type { AuditLogEntry } from '@/types';

export function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  const t = useTranslations('admin');

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3">{t('audit.time')}</th>
            <th className="px-4 py-3">{t('audit.admin')}</th>
            <th className="px-4 py-3">{t('audit.action')}</th>
            <th className="px-4 py-3">{t('audit.entity')}</th>
          </tr>
        </thead>
        <tbody>
          {entries.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-zinc-500">
                {t('audit.empty')}
              </td>
            </tr>
          ) : (
            entries.map((e) => (
              <tr key={e.id} className="border-b border-zinc-100">
                <td className="px-4 py-3 whitespace-nowrap">
                  {new Date(e.createdAt).toLocaleString()}
                </td>
                <td className="px-4 py-3">{e.adminEmail ?? e.adminId}</td>
                <td className="px-4 py-3 font-mono text-xs">{e.action}</td>
                <td className="px-4 py-3">
                  {e.entityType}/{e.entityId}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
