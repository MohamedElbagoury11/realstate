export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthRepository {
  signIn(credentials: AuthCredentials): Promise<string>;
  signUp(credentials: AuthCredentials): Promise<string>;
  signOut(): Promise<void>;
  getCurrentUserId(): Promise<string | null>;
  verifyIdToken(idToken: string): Promise<string>;
}
