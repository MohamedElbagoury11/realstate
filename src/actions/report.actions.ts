'use server';

import { z } from 'zod';
import { getServerSession } from '@/lib/auth-server';
import { reportService } from '@/services/report.service';

const reportSchema = z.object({
  propertyId: z.string().min(1),
  reason: z.enum(['spam', 'misleading', 'duplicate', 'other']),
  details: z.string().max(500).optional(),
});

export async function reportPropertyAction(input: z.infer<typeof reportSchema>) {
  const parsed = reportSchema.parse(input);
  const session = await getServerSession();
  await reportService.reportProperty(
    parsed.propertyId,
    parsed.reason,
    parsed.details,
    session,
  );
}
