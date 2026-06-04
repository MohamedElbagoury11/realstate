'use client';

import { useEffect } from 'react';
import { trackPropertyViewAction } from '@/actions/analytics.actions';

export function PropertyViewTracker({ propertyId }: { propertyId: string }) {
  useEffect(() => {
    const key = `viewed-${propertyId}`;
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(key)) return;
    trackPropertyViewAction(propertyId)
      .then(() => sessionStorage.setItem(key, '1'))
      .catch(() => {});
  }, [propertyId]);

  return null;
}
