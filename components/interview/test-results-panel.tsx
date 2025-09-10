'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle, Clock, Code2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TestResult } from '@/services/api/codeExecutionApi';

interface TestResultsPanelProps {
  results?: {
    results: TestResult[];
    totalPassed: number;
    totalTests: number;
    overallPassed: boolean;
    executionTime: number;
  } | null;
  isLoading?: boolean;
  className?: string;
}

const safeRender = (value: any): string => {
  try {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  } catch (error) {
    return '[Error rendering value]';
  }
};

export function TestResultsPanel({ results, isLoading, className }: TestResultsPanelProps) {
  if (isLoading) {
    return (
      <div className={cn('h-full flex flex-col bg-background border-l', className)}>
        <div className="p-4 border-b bg-muted/50">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            <span className="font-medium text-sm">Running tests...</span>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Code2 className="h-8 w-8 mx-auto mb-2 animate-pulse" />
            <p className="text-sm">Executing your code...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className={cn('h-full flex flex-col bg-background border-l', className)}>
        <div className="p-4 border-b bg-muted/50">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Test Results
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Code2 className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">Click "Run Code" to test your solution</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col bg-background border-l', className)}>
      {/* Header */}
      <div className="p-4 border-b bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm flex items-center gap-2">
            <Code2 className="h-4 w-4" />
            Test Results
          </h3>
          <div className="flex items-center gap-2">
            <Badge 
              variant={results.overallPassed ? "default" : "destructive"}
              className="text-xs"
            >
              {results.totalPassed}/{results.totalTests} Passed
            </Badge>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {results.executionTime}ms
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          {results.results.map((result, index) => (
            <Card 
              key={index} 
              className={cn(
                "transition-all duration-200",
                result.passed 
                  ? "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20" 
                  : "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
              )}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    {result.passed ? (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    Test Case {index + 1}
                  </CardTitle>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {result.executionTime || 0}ms
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                {/* Compact horizontal layout */}
                <div className="space-y-2">
                  {/* Input - single line */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground min-w-12">Input:</span>
                    <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono flex-1 truncate">
                      {JSON.stringify(result.input).length > 30 
                        ? JSON.stringify(result.input).substring(0, 30) + '...'
                        : JSON.stringify(result.input)
                      }
                    </code>
                  </div>

                  {/* Expected vs Actual - horizontal */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground min-w-12">Expected:</span>
                    <code className="bg-green-50 dark:bg-green-950/20 px-2 py-1 rounded font-mono text-green-700 dark:text-green-300 flex-1 truncate">
                      {JSON.stringify(result.expectedOutput).length > 25 
                        ? JSON.stringify(result.expectedOutput).substring(0, 25) + '...'
                        : JSON.stringify(result.expectedOutput)
                      }
                    </code>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground min-w-12">Got:</span>
                    <code className={cn(
                      "px-2 py-1 rounded font-mono flex-1 truncate",
                      result.passed 
                        ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                        : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                    )}>
                      {JSON.stringify(result.actualOutput).length > 25 
                        ? JSON.stringify(result.actualOutput).substring(0, 25) + '...'
                        : JSON.stringify(result.actualOutput)
                      }
                    </code>
                  </div>

                  {/* Error message - compact */}
                  {result.error && (
                    <div className="bg-red-50 dark:bg-red-950/20 p-2 rounded border border-red-200 dark:border-red-800">
                      <div className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">Error:</div>
                      <div className="text-xs text-red-600 dark:text-red-400 font-mono break-words">
                        {result.error.length > 80 
                          ? result.error.substring(0, 80) + '...'
                          : result.error
                        }
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
