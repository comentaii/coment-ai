import { getAppVersion } from '@/lib/version';

export const VersionBadge = () => {
  const version = getAppVersion();
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 font-mono">
        v{version}
      </div>
    </div>
  );
};
