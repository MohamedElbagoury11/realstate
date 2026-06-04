import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import type { AuthRepository } from '@/repositories/interfaces/auth.repository';
import { getFirebaseAuth } from '@/providers/firebase/client';

export class FirebaseAuthClientRepository implements AuthRepository {
  async signIn(credentials: { email: string; password: string }): Promise<string> {
    const result = await signInWithEmailAndPassword(
      getFirebaseAuth(),
      credentials.email,
      credentials.password,
    );
    return result.user.getIdToken();
  }

  async signUp(credentials: { email: string; password: string }): Promise<string> {
    const result = await createUserWithEmailAndPassword(
      getFirebaseAuth(),
      credentials.email,
      credentials.password,
    );
    return result.user.getIdToken();
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(getFirebaseAuth());
  }

  async getCurrentUserId(): Promise<string | null> {
    const auth = getFirebaseAuth();
    if (auth.currentUser) return auth.currentUser.uid;
    return new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, (user) => {
        unsub();
        resolve(user?.uid ?? null);
      });
    });
  }

  async verifyIdToken(_idToken: string): Promise<string> {
    const auth = getFirebaseAuth();
    if (!auth.currentUser) throw new Error('Not authenticated');
    return auth.currentUser.getIdToken(true);
  }
}
