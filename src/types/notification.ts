export type NotificationType =
  | 'property.approved'
  | 'property.rejected'
  | 'property.hidden'
  | 'property.lead'
  | 'property.reported';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  propertyId?: string;
  read: boolean;
  createdAt: string;
}
