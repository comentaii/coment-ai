'use client';

import { Logo } from './logo';

export function FullPageLoader() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="animate-pulse">
        <Logo size="2xl" />
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-300">
        Yükleniyor...
      </p>
    </div>
  );
}
