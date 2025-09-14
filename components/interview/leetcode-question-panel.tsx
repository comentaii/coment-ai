'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface LeetCodeQuestionPanelProps {
  question: any;
  className?: string;
}

const safeRender = (value: any): string => {
  try {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  } catch (error) {
    return '[Error rendering value]';
  }
};

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'text-green-600 dark:text-green-400';
    case 'medium': return 'text-yellow-600 dark:text-yellow-400';
    case 'hard': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

export function LeetCodeQuestionPanel({ question, className }: LeetCodeQuestionPanelProps) {
  if (!question) {
    return (
      <div className={cn('flex items-center justify-center h-full bg-background', className)}>
        <div className="text-center text-muted-foreground">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading question...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-foreground">
                {question.title}
              </h1>
              <Badge 
                variant="secondary" 
                className={cn("font-medium", getDifficultyColor(question.difficulty))}
              >
                {question.difficulty}
              </Badge>
            </div>
            
            {/* Description */}
            <div className="text-sm text-foreground leading-relaxed">
              {question.description}
            </div>
          </div>

          {/* Examples */}
          {question.examples && Array.isArray(question.examples) && question.examples.length > 0 && (
            <div className="space-y-4">
              {question.examples.slice(0, 3).map((example: any, index: number) => (
                <div key={index} className="space-y-3">
                  <div className="font-semibold text-sm">
                    <strong>Example {index + 1}:</strong>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                    <div className="space-y-2">
                      <div>
                        <span className="font-semibold">Input:</span> {safeRender(example.input)}
                      </div>
                      <div>
                        <span className="font-semibold">Output:</span> {safeRender(example.output)}
                      </div>
                      {example.explanation && (
                        <div>
                          <span className="font-semibold">Explanation:</span> {example.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator />

          {/* Constraints */}
          {question.constraints && Array.isArray(question.constraints) && question.constraints.length > 0 && (
            <div className="space-y-3">
              <div className="font-semibold text-sm">
                <strong>Constraints:</strong>
              </div>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {question.constraints.map((constraint: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <code className="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">
                      {constraint}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Hints */}
          {question.hints && Array.isArray(question.hints) && question.hints.length > 0 && (
            <div className="space-y-3">
              <div className="font-semibold text-sm">
                <strong>Hints:</strong>
              </div>
              <div className="space-y-2">
                {question.hints.map((hint: string, index: number) => (
                  <div key={index} className="text-sm text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border-l-4 border-blue-400">
                    <span className="font-medium text-blue-700 dark:text-blue-300">Hint {index + 1}:</span> {hint}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Topics */}
          {question.topic && (
            <div className="pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium">Related Topics:</span>
                <Badge variant="outline" className="text-xs">
                  {question.topic}
                </Badge>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
