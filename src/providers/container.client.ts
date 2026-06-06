'use client';

import type { AuthRepository } from '@/repositories/interfaces/auth.repository';
import { FirebaseAuthClientRepository } from '@/repositories/firebase/auth.client.repository';

export function getAuthClientRepository(): AuthRepository {
  // safe: no module-level state (prevents SSR crash)
  return new FirebaseAuthClientRepository();
}