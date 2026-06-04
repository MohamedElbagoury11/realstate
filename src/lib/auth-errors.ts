import { FirebaseError } from 'firebase/app';

export function isFirebaseAuthError(error: unknown): error is FirebaseError {
  return error instanceof FirebaseError && error.code.startsWith('auth/');
}

export function isEmailAlreadyInUse(error: unknown): boolean {
  return isFirebaseAuthError(error) && error.code === 'auth/email-already-in-use';
}

/** Translation key under the `errors` namespace (e.g. `auth.emailAlreadyInUse`). */
export function getAuthErrorKey(error: unknown): string {
  if (isFirebaseAuthError(error)) {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'auth.emailAlreadyInUse';
      case 'auth/invalid-email':
        return 'auth.invalidEmail';
      case 'auth/weak-password':
        return 'auth.weakPassword';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'auth.wrongPassword';
      case 'auth/too-many-requests':
        return 'auth.tooManyRequests';
      default:
        return 'auth.generic';
    }
  }

  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes('Firebase Admin is not configured')) {
      return 'auth.serverConfig';
    }
    if (msg.includes('Firestore') || msg.includes('PERMISSION_DENIED')) {
      return 'auth.firestoreProfile';
    }
  }

  return 'auth.registrationFailed';
}

/** @deprecated Use getAuthErrorKey with useTranslations('errors') */
export function getAuthErrorMessage(error: unknown): string {
  return getAuthErrorKey(error);
}
