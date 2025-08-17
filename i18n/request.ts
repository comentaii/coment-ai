import { getRequestConfig } from 'next-intl/server'
import { headers } from 'next/headers'

export default getRequestConfig(async () => {
  const headersData = await headers()
  const locale = headersData.get('x-next-intl-locale') || 'tr'

  return {
    locale,
    timeZone: 'Europe/Istanbul',
    messages: (await import(`./locales/${locale}/common.json`)).default,
    defaultTranslationValues: {
      strong: chunks => `<strong>${chunks}</strong>`,
    },
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        },
      },
    },
    onError: error => {
      if (error.message.includes('NOT_FOUND')) {
        console.warn('Missing translation:', error.message)
      } else {
        console.error('Translation error:', error)
      }
    },
  }
})