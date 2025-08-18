import { redirect } from 'next/navigation';

/**
 * 404 Not Found sayfasına yönlendirir
 */
export function redirectToNotFound() {
  redirect('/not-found');
}

/**
 * 401 Unauthorized sayfasına yönlendirir
 */
export function redirectToUnauthorized() {
  redirect('/unauthorized');
}

/**
 * 403 Forbidden sayfasına yönlendirir
 */
export function redirectToForbidden() {
  redirect('/forbidden');
}

/**
 * Belirli bir HTTP status code'una göre yönlendirme yapar
 */
export function redirectByStatusCode(statusCode: number) {
  switch (statusCode) {
    case 401:
      redirectToUnauthorized();
      break;
    case 403:
      redirectToForbidden();
      break;
    case 404:
      redirectToNotFound();
      break;
    default:
      // 500+ server errors için error.tsx kullanılır
      throw new Error(`HTTP ${statusCode} - Server Error`);
  }
}

/**
 * Locale-aware error sayfalarına yönlendirme
 */
export function redirectToLocalizedError(locale: string, errorType: 'not-found' | 'unauthorized' | 'forbidden') {
  const paths = {
    'not-found': `/${locale}/not-found`,
    'unauthorized': `/${locale}/unauthorized`,
    'forbidden': `/${locale}/forbidden`,
  };
  
  redirect(paths[errorType]);
}

/**
 * Locale-aware HTTP status code yönlendirmesi
 */
export function redirectByStatusCodeWithLocale(locale: string, statusCode: number) {
  switch (statusCode) {
    case 401:
      redirectToLocalizedError(locale, 'unauthorized');
      break;
    case 403:
      redirectToLocalizedError(locale, 'forbidden');
      break;
    case 404:
      redirectToLocalizedError(locale, 'not-found');
      break;
    default:
      throw new Error(`HTTP ${statusCode} - Server Error`);
  }
}
