import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { loadMessages } from './load-messages';
import { routing, type Locale } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? (requested as Locale)
    : routing.defaultLocale;

  return {
    locale,
    messages: loadMessages(locale),
  };
});
