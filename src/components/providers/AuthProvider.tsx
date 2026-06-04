'use client';

import { useEffect } from 'react';
import { getSessionAction } from '@/actions/auth.actions';
import { useAuthStore } from '@/stores/auth.store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);
  const setInitializing = useAuthStore((s) => s.setInitializing);

  useEffect(() => {
    getSessionAction()
      .then((user) => setUser(user))
      .catch(() => setUser(null))
      .finally(() => setInitializing(false));
  }, [setUser, setInitializing]);

  return children;
}
