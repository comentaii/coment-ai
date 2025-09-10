'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { Lightbulb, Target, CheckCircle2, ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Safe render function for any value type
const safeRender = (value: any): string => {
  try {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'object') {
      // Handle circular references and complex objects
      return JSON.stringify(value, (key, val) => {
        // Prevent circular references
        if (val === value) return '[Circular]';
        return val;
      }, 2);
    }
    return String(value);
  } catch (error) {
    console.warn('Error rendering value:', error, value);
    return '[Error rendering value]';
  }
};

interface QuestionPanelProps {
  question: any;
  className?: string;
}

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty?.toLowerCase()) {
    case 'easy':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'hard':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export function QuestionPanel({ question, className }: QuestionPanelProps) {
  const [showExamples, setShowExamples] = useState(true);
  const [showConstraints, setShowConstraints] = useState(true);
  const [showHints, setShowHints] = useState(false);
  const [showTestCases, setShowTestCases] = useState(false);

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

  // Validate question structure to prevent render errors
  try {
    // Ensure question has required properties
    if (!question.title || !question.description) {
      throw new Error('Invalid question structure');
    }
  } catch (error) {
    console.error('Question validation error:', error, question);
    return (
      <div className={cn('flex items-center justify-center h-full bg-background', className)}>
        <div className="text-center text-muted-foreground">
          <p>Error loading question. Please try generating a new one.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      <ScrollArea className="flex-1 h-full">
        <div className="p-4 space-y-4 min-h-full">
          {/* Question Header - Compact */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={cn(getDifficultyColor(question.difficulty), "px-2 py-1 text-xs font-semibold")}>
                {question.difficulty.toUpperCase()}
              </Badge>
              {question.topic && (
                <Badge variant="secondary" className="px-2 py-1 text-xs font-semibold">
                  {question.topic.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <h1 className="text-xl font-bold leading-tight text-foreground">
              {question.title}
            </h1>
            
            <div className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-md border">
              {question.description}
            </div>
          </div>

          <Separator />

          {/* Examples - Collapsible */}
          {question.examples && question.examples.length > 0 && (
            <Collapsible open={showExamples} onOpenChange={setShowExamples}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-100 dark:bg-blue-900/30 rounded">
                      <Target className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="font-semibold text-sm">Examples ({question.examples?.length || 0})</span>
                  </div>
                  {showExamples ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-3">
                {question.examples && Array.isArray(question.examples) && question.examples.slice(0, 2).map((example: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/20 to-transparent dark:from-blue-950/10">
                    <CardContent className="p-3 space-y-3">
                      <div className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                        Example {index + 1}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="text-xs font-medium text-foreground">Input:</span>
                          <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded border mt-1">
                            <code>
                              {safeRender(example.input)}
                            </code>
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground">Output:</span>
                          <pre className="text-xs bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800 mt-1">
                            <code>
                              {safeRender(example.output)}
                            </code>
                          </pre>
                        </div>
                        {example.explanation && (
                          <div className="pt-1 border-t">
                            <span className="text-xs font-medium text-foreground">Explanation:</span>
                            <p className="text-xs text-muted-foreground mt-1 bg-amber-50 dark:bg-amber-950/20 p-2 rounded border border-amber-200 dark:border-amber-800">
                              {example.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(question.examples?.length || 0) > 2 && (
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground">
                      ... and {(question.examples?.length || 0) - 2} more examples
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}

          <Separator />

          {/* Constraints - Collapsible */}
          {question.constraints && question.constraints.length > 0 && (
            <Collapsible open={showConstraints} onOpenChange={setShowConstraints}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-orange-100 dark:bg-orange-900/30 rounded">
                      <CheckCircle2 className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="font-semibold text-sm">Constraints ({question.constraints?.length || 0})</span>
                  </div>
                  {showConstraints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="bg-orange-50 dark:bg-orange-950/20 p-3 rounded-md border border-orange-200 dark:border-orange-800">
                  <ul className="space-y-2">
                    {question.constraints && Array.isArray(question.constraints) && question.constraints.map((constraint: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono">
                          {constraint}
                        </code>
                      </li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Hints - Collapsible & Hidden by Default */}
          {question.hints && question.hints.length > 0 && (
            <Collapsible open={showHints} onOpenChange={setShowHints}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-yellow-100 dark:bg-yellow-900/30 rounded">
                      <Lightbulb className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <span className="font-semibold text-sm">Hints ({question.hints?.length || 0})</span>
                    {!showHints && <Eye className="h-3 w-3 ml-1" />}
                  </div>
                  {showHints ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {question.hints && Array.isArray(question.hints) && question.hints.map((hint: string, index: number) => (
                  <Card key={index} className="border-l-4 border-l-yellow-500 bg-gradient-to-r from-yellow-50/20 to-transparent dark:from-yellow-950/10">
                    <CardContent className="p-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </div>
                        <p className="text-xs leading-relaxed text-foreground">
                          {hint}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Test Cases - Collapsible & Hidden by Default */}
          {question.testCases && question.testCases.length > 0 && (
            <Collapsible open={showTestCases} onOpenChange={setShowTestCases}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 w-full justify-start p-2 h-auto">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                      <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold text-sm">Test Cases ({question.testCases?.length || 0})</span>
                    {!showTestCases && <EyeOff className="h-3 w-3 ml-1" />}
                  </div>
                  {showTestCases ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                {question.testCases && Array.isArray(question.testCases) && question.testCases.slice(0, 2).map((testCase: any, index: number) => (
                  <Card key={index} className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/20 to-transparent dark:from-purple-950/10">
                    <CardContent className="p-3 space-y-2">
                      <div className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                        Test Case {index + 1}
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        <div>
                          <span className="text-xs font-medium text-foreground">Input:</span>
                          <pre className="text-xs bg-slate-100 dark:bg-slate-800 p-2 rounded border mt-1">
                            <code>
                              {safeRender(testCase.input)}
                            </code>
                          </pre>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-foreground">Expected:</span>
                          <pre className="text-xs bg-green-50 dark:bg-green-950/20 p-2 rounded border border-green-200 dark:border-green-800 mt-1">
                            <code>
                              {safeRender(testCase.expectedOutput)}
                            </code>
                          </pre>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(question.testCases?.length || 0) > 2 && (
                  <div className="text-center p-2 bg-muted/30 rounded-md border border-dashed">
                    <p className="text-xs text-muted-foreground">
                      ... and {(question.testCases?.length || 0) - 2} more test cases will be used for evaluation
                    </p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
