'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const START_EVENT = 'app:navigation-start';

export function startNavigationFeedback() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(START_EVENT));
  }
}

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    function start() {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
      setActive(true);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as Element | null)?.closest('a[href]');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      const target = anchor.getAttribute('target');
      if (!href || href.startsWith('#') || target === '_blank') return;

      try {
        const nextUrl = new URL(href, window.location.href);
        if (nextUrl.origin !== window.location.origin) return;
        if (nextUrl.pathname === window.location.pathname && nextUrl.search === window.location.search) return;
        start();
      } catch {
        /* ignore malformed hrefs */
      }
    }

    window.addEventListener(START_EVENT, start);
    window.addEventListener('beforeunload', start);
    document.addEventListener('click', onClick, true);

    return () => {
      window.removeEventListener(START_EVENT, start);
      window.removeEventListener('beforeunload', start);
      document.removeEventListener('click', onClick, true);
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!active) return;
    timeoutRef.current = window.setTimeout(() => setActive(false), 350);
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, [active, pathname, searchParams]);

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-x-0 top-0 z-[100] h-1 origin-left bg-[var(--brand-light)] shadow-sm transition-all duration-300 ${
        active ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'
      }`}
    />
  );
}
