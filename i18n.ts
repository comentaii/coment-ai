import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: {
    common: (await import(`./i18n/locales/${locale}/common.json`)).default,
    api: (await import(`./i18n/locales/${locale}/api.json`)).default,
  }
}));
