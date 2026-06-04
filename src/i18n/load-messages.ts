import type { Locale } from './routing';

import enAdmin from '../../messages/en/admin.json';
import enAuth from '../../messages/en/auth.json';
import enCommon from '../../messages/en/common.json';
import enErrors from '../../messages/en/errors.json';
import enMetadata from '../../messages/en/metadata.json';
import enProperty from '../../messages/en/property.json';
import enPublic from '../../messages/en/public.json';
import enSeller from '../../messages/en/seller.json';
import enValidation from '../../messages/en/validation.json';

import arAdmin from '../../messages/ar/admin.json';
import arAuth from '../../messages/ar/auth.json';
import arCommon from '../../messages/ar/common.json';
import arErrors from '../../messages/ar/errors.json';
import arMetadata from '../../messages/ar/metadata.json';
import arProperty from '../../messages/ar/property.json';
import arPublic from '../../messages/ar/public.json';
import arSeller from '../../messages/ar/seller.json';
import arValidation from '../../messages/ar/validation.json';

const catalogs: Record<
  Locale,
  {
    common: typeof enCommon;
    auth: typeof enAuth;
    public: typeof enPublic;
    property: typeof enProperty;
    admin: typeof enAdmin;
    seller: typeof enSeller;
    validation: typeof enValidation;
    errors: typeof enErrors;
    metadata: typeof enMetadata;
  }
> = {
  en: {
    common: enCommon,
    auth: enAuth,
    public: enPublic,
    property: enProperty,
    admin: enAdmin,
    seller: enSeller,
    validation: enValidation,
    errors: enErrors,
    metadata: enMetadata,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    public: arPublic,
    property: arProperty,
    admin: arAdmin,
    seller: arSeller,
    validation: arValidation,
    errors: arErrors,
    metadata: arMetadata,
  },
};

export function loadMessages(locale: Locale) {
  return catalogs[locale];
}
