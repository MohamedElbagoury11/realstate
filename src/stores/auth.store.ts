'use client';

import { create } from 'zustand';
import type { SessionUser } from '@/types';

interface AuthState {
  user: SessionUser | null;
  initializing: boolean;
  setUser: (user: SessionUser | null) => void;
  setInitializing: (initializing: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initializing: true,
  setUser: (user) => set({ user, initializing: false }),
  setInitializing: (initializing) => set({ initializing }),
}));
