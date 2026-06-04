'use client';

import { create } from 'zustand';
import type { PropertyFilters, PropertyType } from '@/types';

interface FiltersState extends PropertyFilters {
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
}

const initial: PropertyFilters = {
  page: 1,
  pageSize: 12,
};

export const useFiltersStore = create<FiltersState>((set) => ({
  ...initial,
  setFilters: (filters) => set((s) => ({ ...s, ...filters, page: filters.page ?? 1 })),
  resetFilters: () => set(initial),
}));
