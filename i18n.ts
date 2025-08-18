import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => ({
  messages: {
    ...(await import(`./i18n/locales/${locale}/common.json`)).default,
    ...(await import(`./i18n/locales/${locale}/api.json`)).default,
  }
}));
