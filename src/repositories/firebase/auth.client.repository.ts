import type { AuthRepository } from '@/repositories/interfaces/auth.repository';
import { getFirebaseAuth } from '@/providers/firebase/client';

export class FirebaseAuthClientRepository implements AuthRepository {

  async signIn(credentials: { email: string; password: string }): Promise<string> {
    const { signInWithEmailAndPassword } = await import('firebase/auth');

    const result = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      credentials.email,
      credentials.password
    );

    return result.user.getIdToken();
  }

  async signUp(credentials: { email: string; password: string }): Promise<string> {
    const { createUserWithEmailAndPassword } = await import('firebase/auth');

    const result = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      credentials.email,
      credentials.password
    );

    return result.user.getIdToken();
  }

  async signOut(): Promise<void> {
    const { signOut } = await import('firebase/auth');
    await signOut(getFirebaseAuth());
  }

  async getCurrentUserId(): Promise<string | null> {
    const auth = getFirebaseAuth();
    return auth.currentUser?.uid ?? null;
  }

  async verifyIdToken(): Promise<string> {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) throw new Error('Not authenticated');
    return auth.currentUser.getIdToken(true);
  }
}