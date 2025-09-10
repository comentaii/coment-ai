'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { 
  Target, 
  CheckCircle2, 
  Lightbulb, 
  ChevronDown, 
  ChevronRight,
  Eye,
  EyeOff,
  TestTube
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface CompactQuestionPanelProps {
  question: any;
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

const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty?.toLowerCase()) {
    case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
};

export function CompactQuestionPanel({ question, className }: CompactQuestionPanelProps) {
  const [showExamples, setShowExamples] = useState(false);
  const [showConstraints, setShowConstraints] = useState(false);
  const [showHints, setShowHints] = useState(false);

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
      {/* Fixed Header */}
      <div className="flex-shrink-0 p-4 border-b bg-gradient-to-r from-blue-50/50 to-transparent dark:from-blue-950/20">
        <div className="space-y-3">
          {/* Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={cn(getDifficultyColor(question.difficulty), "px-2 py-1 text-xs font-semibold")}>
              {question.difficulty?.toUpperCase()}
            </Badge>
            {question.topic && (
              <Badge variant="secondary" className="px-2 py-1 text-xs font-semibold">
                {question.topic.toUpperCase()}
              </Badge>
            )}
          </div>
          
          {/* Title */}
          <h1 className="text-lg font-bold leading-tight text-foreground">
            {question.title}
          </h1>
          
          {/* Description */}
          <div className="text-sm text-muted-foreground leading-relaxed bg-muted/20 p-3 rounded-md border max-h-20 overflow-y-auto">
            {question.description}
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3">
          
          {/* Test Cases Preview - Always Visible & Compact */}
          {question.testCases && Array.isArray(question.testCases) && question.testCases.length > 0 && (
            <Card className="border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50/20 to-transparent dark:from-purple-950/10">
              <CardContent className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-purple-100 dark:bg-purple-900/30 rounded">
                      <TestTube className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="font-semibold text-xs">Test Cases ({question.testCases?.length || 0})</span>
                  </div>
                </div>
                
                {/* Compact horizontal test case display */}
                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-md p-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Input:</span>
                      <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded text-xs font-mono">
                        {JSON.stringify(question.testCases[0]?.input).length > 20 
                          ? JSON.stringify(question.testCases[0]?.input).substring(0, 20) + '...'
                          : JSON.stringify(question.testCases[0]?.input)
                        }
                      </code>
                    </div>
                    <div className="text-muted-foreground">→</div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Expected:</span>
                      <code className="bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded text-xs font-mono text-green-700 dark:text-green-300">
                        {JSON.stringify(question.testCases[0]?.expectedOutput).length > 20 
                          ? JSON.stringify(question.testCases[0]?.expectedOutput).substring(0, 20) + '...'
                          : JSON.stringify(question.testCases[0]?.expectedOutput)
                        }
                      </code>
                    </div>
                  </div>
                  {question.testCases.length > 1 && (
                    <div className="text-xs text-muted-foreground mt-1 text-center">
                      +{question.testCases.length - 1} more test cases
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          {/* Collapsible Sections */}
          
          {/* Examples */}
          {question.examples && Array.isArray(question.examples) && question.examples.length > 0 && (
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
              <CollapsibleContent className="space-y-2">
                {question.examples.slice(0, 2).map((example: any, index: number) => (
                  <div key={index} className="bg-blue-50/50 dark:bg-blue-950/20 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                    <div className="text-xs font-semibold text-blue-700 dark:text-blue-300 mb-2">
                      Example {index + 1}
                    </div>
                    
                    {/* Horizontal compact layout */}
                    <div className="flex items-center gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Input:</span>
                        <code className="bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono">
                          {JSON.stringify(example.input).length > 15 
                            ? JSON.stringify(example.input).substring(0, 15) + '...'
                            : JSON.stringify(example.input)
                          }
                        </code>
                      </div>
                      <div className="text-muted-foreground">→</div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Output:</span>
                        <code className="bg-green-50 dark:bg-green-950/30 px-1.5 py-0.5 rounded font-mono text-green-700 dark:text-green-300">
                          {JSON.stringify(example.output).length > 15 
                            ? JSON.stringify(example.output).substring(0, 15) + '...'
                            : JSON.stringify(example.output)
                          }
                        </code>
                      </div>
                    </div>
                    
                    {/* Explanation - compact */}
                    {example.explanation && (
                      <div className="mt-2 pt-2 border-t border-blue-200 dark:border-blue-700">
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {example.explanation.length > 100 
                            ? example.explanation.substring(0, 100) + '...'
                            : example.explanation
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Constraints */}
          {question.constraints && Array.isArray(question.constraints) && question.constraints.length > 0 && (
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
                  <div className="flex flex-wrap gap-2">
                    {question.constraints.map((constraint: string, index: number) => (
                      <code key={index} className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono inline-block">
                        {constraint.length > 25 ? constraint.substring(0, 25) + '...' : constraint}
                      </code>
                    ))}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Hints */}
          {question.hints && Array.isArray(question.hints) && question.hints.length > 0 && (
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
              <CollapsibleContent>
                <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-md border border-yellow-200 dark:border-yellow-800 space-y-2">
                  {question.hints.map((hint: string, index: number) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-shrink-0 w-4 h-4 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                        {index + 1}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {hint.length > 120 ? hint.substring(0, 120) + '...' : hint}
                      </p>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
