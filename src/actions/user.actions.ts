'use server';

import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth-server';
import { userService } from '@/services/user.service';
import { auditService } from '@/services/audit.service';

export async function approveSellerAction(userId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await userService.approveSeller(session, userId);
  await auditService.log(session, 'seller.approved', 'user', userId);
  revalidatePath('/admin/users');
  revalidatePath('/seller/dashboard');
}

export async function rejectSellerAction(userId: string) {
  const session = await getServerSession();
  if (!session) throw new Error('Unauthorized');
  await userService.rejectSeller(session, userId);
  await auditService.log(session, 'seller.rejected', 'user', userId);
  revalidatePath('/admin/users');
  revalidatePath('/seller/dashboard');
}
