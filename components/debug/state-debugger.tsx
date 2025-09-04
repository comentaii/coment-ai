'use client';

import { useState } from 'react';
import { useAppSelector } from '@/hooks/use-redux';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Bug, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export function StateDebugger() {
  const [isOpen, setIsOpen] = useState(false);
  const reduxState = useAppSelector((state) => state);
  const { data: session } = useSession();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <div 
        className={cn(
          "bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out font-mono",
          isOpen ? 'w-96 p-4' : 'w-auto p-2'
        )}
      >
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-2">
            <Bug className="h-5 w-5 text-yellow-500" />
            <h3 className={cn("font-bold", !isOpen && "hidden")}>State Debugger</h3>
          </div>
          <Button variant="ghost" size="sm" className="p-1 h-auto">
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </div>
        
        {isOpen && (
          <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto">
            <div>
              <h4 className="font-semibold text-sm mb-1 text-blue-500">Redux State:</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md whitespace-pre-wrap break-all">
                {JSON.stringify(reduxState, null, 2)}
              </pre>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-1 text-green-500">NextAuth Session:</h4>
              <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded-md whitespace-pre-wrap break-all">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 