import type { AuthRepository } from '@/repositories/interfaces/auth.repository';
import { getAdminAuth } from '@/providers/firebase/admin';

export class FirebaseAuthServerRepository implements Pick<AuthRepository, 'verifyIdToken'> {
  async verifyIdToken(idToken: string): Promise<string> {
    const decoded = await getAdminAuth().verifyIdToken(idToken);
    return decoded.uid;
  }
}
