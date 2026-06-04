import type { AuthRepository } from '@/repositories/interfaces/auth.repository';
import { FirebaseAuthClientRepository } from '@/repositories/firebase/auth.client.repository';

let authClientRepo: AuthRepository | undefined;

export function getAuthClientRepository(): AuthRepository {
  if (!authClientRepo) authClientRepo = new FirebaseAuthClientRepository();
  return authClientRepo;
}
