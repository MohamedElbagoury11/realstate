export type ReportReason = 'spam' | 'misleading' | 'duplicate' | 'other';

export interface PropertyReport {
  id: string;
  propertyId: string;
  propertyTitle: string;
  reason: ReportReason;
  details?: string;
  reporterId?: string;
  createdAt: string;
}
