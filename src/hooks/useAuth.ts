'use client';

import { useCallback } from 'react';
import { useLocale } from 'next-intl';
import {
  establishSessionAction,
  logoutAction,
  registerProfileAction,
} from '@/actions/auth.actions';
import type { RegisterInput } from '@/lib/validation/i18n-schemas';
import type { LoginInput } from '@/lib/validation/i18n-schemas';
import { isEmailAlreadyInUse } from '@/lib/auth-errors';
import { getPostAuthDestination } from '@/lib/session';
import { routing } from '@/i18n/routing';
import { getAuthClientRepository } from '@/providers/container.client';
import { useAuthStore } from '@/stores/auth.store';
import type { SessionUser } from '@/types';

function getRedirectParam(): string | null {
  if (typeof window === 'undefined') return null;
  return new URLSearchParams(window.location.search).get('redirect');
}

function pathHasLocale(path: string): boolean {
  const segment = path.split('/')[1];
  return routing.locales.includes(segment as (typeof routing.locales)[number]);
}

function withLocale(path: string, locale: string): string {
  if (pathHasLocale(path)) return path;
  if (path === '/') return `/${locale}`;
  return `/${locale}${path}`;
}

export function useAuth() {
  const locale = useLocale();
  const { user, setUser } = useAuthStore();
  const authRepo = getAuthClientRepository();

  const completeAuthNavigation = useCallback(
    (sessionUser: SessionUser) => {
      const dest = withLocale(getPostAuthDestination(sessionUser, getRedirectParam()), locale);
      window.location.assign(dest);
    },
    [locale],
  );

  const login = useCallback(
    async (input: LoginInput) => {
      const idToken = await authRepo.signIn(input);
      const { user: sessionUser } = await establishSessionAction(idToken);
      setUser(sessionUser);
      completeAuthNavigation(sessionUser);
    },
    [authRepo, setUser, completeAuthNavigation],
  );

  const register = useCallback(
    async (input: RegisterInput) => {
      let idToken: string;
      try {
        idToken = await authRepo.signUp({
          email: input.email,
          password: input.password,
        });
      } catch (error) {
        if (!isEmailAlreadyInUse(error)) throw error;
        idToken = await authRepo.signIn({
          email: input.email,
          password: input.password,
        });
      }
      const { user: sessionUser } = await registerProfileAction(idToken, input);
      setUser(sessionUser);
      completeAuthNavigation(sessionUser);
    },
    [authRepo, setUser, completeAuthNavigation],
  );

  const logout = useCallback(async () => {
    await authRepo.signOut();
    await logoutAction();
    setUser(null);
    window.location.assign(`/${locale}`);
  }, [authRepo, setUser, locale]);

  return { user, login, register, logout };
}
