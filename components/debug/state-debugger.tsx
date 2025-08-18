'use client';

import { useAppSelector } from '@/hooks/use-redux';

export function StateDebugger() {
  const globalSettings = useAppSelector((state) => state.globalSettings);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 text-xs font-mono z-50">
      <h3 className="font-bold mb-2">Redux State Debug:</h3>
      <pre className="text-xs">
        {JSON.stringify(globalSettings, null, 2)}
      </pre>
    </div>
  );
} 