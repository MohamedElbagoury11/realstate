import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { firebaseClientConfig, isFirebaseConfigured } from './config';

export function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase client used on server');
  }

  if (!isFirebaseConfigured()) {
    throw new Error('Missing Firebase env vars');
  }

  return getApps().length
    ? getApps()[0]
    : initializeApp(firebaseClientConfig);
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}