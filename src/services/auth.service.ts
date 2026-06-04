import type { SessionUser } from '@/types';
import { getUserRepository } from '@/providers/container.server';
import { FirebaseAuthServerRepository } from '@/repositories/firebase/auth.server.repository';

export class AuthService {
  private readonly authServer = new FirebaseAuthServerRepository();
  private readonly users = getUserRepository();

  async getSessionFromToken(idToken: string): Promise<SessionUser | null> {
    try {
      const uid = await this.authServer.verifyIdToken(idToken);
      const profile = await this.users.getById(uid);
      if (!profile) return null;
      return {
        id: profile.id,
        email: profile.email,
        name: profile.name,
        role: profile.role,
        approved: profile.approved,
      };
    } catch {
      return null;
    }
  }
}

export const authService = new AuthService();
