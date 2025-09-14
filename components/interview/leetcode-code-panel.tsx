'use client';

import { useState, useCallback, useMemo, memo, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  Play, 
  RotateCcw, 
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock,
  TestTube,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Simple debounce utility
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

interface LeetCodeCodePanelProps {
  question?: any;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  isRunning?: boolean;
  testResults?: any;
  className?: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
] as const;

const safeRender = (value: any): string => {
  try {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  } catch (error) {
    return '[Error rendering value]';
  }
};

export const LeetCodeCodePanel = memo(function LeetCodeCodePanel({ 
  question, 
  onCodeChange, 
  onLanguageChange,
  onRunCode,
  isRunning = false,
  testResults,
  className 
}: LeetCodeCodePanelProps) {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [showTestCase, setShowTestCase] = useState<boolean>(false);
  const [showTestResult, setShowTestResult] = useState<boolean>(false);

  // Highly optimized editor options for zero lag
  const editorOptions = useMemo(() => ({
    minimap: { enabled: false },
    fontSize: 14,
    fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'off' as const,
    folding: false, // Disable for better performance
    dragAndDrop: false, // Disable for better performance
    links: false, // Disable for better performance
    mouseWheelZoom: false, // Disable for better performance
    contextmenu: false, // Disable for better performance
    quickSuggestions: false, // Disable for better performance
    suggestOnTriggerCharacters: false, // Disable for better performance
    wordBasedSuggestions: false, // Disable for better performance
    parameterHints: { enabled: false }, // Disable for better performance
    hover: { enabled: false }, // Disable for better performance
    occurrencesHighlight: false, // Disable for better performance
    selectionHighlight: false, // Disable for better performance
    renderWhitespace: 'none', // Disable for better performance
    renderControlCharacters: false, // Disable for better performance
    renderIndentGuides: false, // Disable for better performance
    codeLens: false, // Disable for better performance
    lightbulb: { enabled: false }, // Disable for better performance
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
      verticalScrollbarSize: 8,
      horizontalScrollbarSize: 8,
      useShadows: false, // Disable for better performance
    },
    // Performance optimizations
    acceptSuggestionOnCommitCharacter: false,
    acceptSuggestionOnEnter: 'off',
    accessibilitySupport: 'off',
    autoIndent: 'none',
    colorDecorators: false,
    cursorBlinking: 'solid',
    cursorSmoothCaretAnimation: false,
    disableLayerHinting: true,
    fontLigatures: false,
    formatOnPaste: false,
    formatOnType: false,
    glyphMargin: false,
    hideCursorInOverviewRuler: true,
    lineDecorationsWidth: 0,
    lineNumbersMinChars: 3,
    overviewRulerBorder: false,
    overviewRulerLanes: 0,
    renderFinalNewline: false,
    renderLineHighlight: 'none',
    rulers: [],
    smoothScrolling: false,
    wordBasedSuggestionsOnlySameLanguage: false,
  }), []);

  // Starter code based on language and question
  const starterCode = useMemo(() => {
    if (question?.starterCode?.[language]) {
      return question.starterCode[language];
    }
    
    const templates = {
      javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
var twoSum = function(nums, target) {
    // Write your solution here
};`,
      python: `def minimumTeachings(n, languages, friendships):
    """
    :type n: int
    :type languages: List[List[int]]
    :type friendships: List[List[int]]
    :rtype: int
    """
    # Write your solution here
    pass`,
      java: `class Solution {
    public int minimumTeachings(int n, int[][] languages, int[][] friendships) {
        // Write your solution here
        return 0;
    }
}`,
      cpp: `class Solution {
public:
    int minimumTeachings(int n, vector<vector<int>>& languages, vector<vector<int>>& friendships) {
        // Write your solution here
        return 0;
    }
};`
    };
    
    return templates[language as keyof typeof templates] || '';
  }, [question, language]);

  // Debounced change handler for better performance
  const debouncedCodeChange = useCallback(
    debounce((code: string) => {
      onCodeChange(code);
    }, 100), // 100ms debounce
    [onCodeChange]
  );

  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    debouncedCodeChange(newCode);
  }, [debouncedCodeChange]);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
    const newCode = question?.starterCode?.[newLanguage] || '';
    setCode(newCode);
    onCodeChange(newCode);
  }, [onLanguageChange, onCodeChange, question]);

  const handleReset = useCallback(() => {
    const resetCode = starterCode;
    setCode(resetCode);
    onCodeChange(resetCode);
  }, [starterCode, onCodeChange]);

  const handleRunCode = useCallback(() => {
    if (!isRunning) {
      onRunCode();
      setShowTestResult(true);
    }
  }, [onRunCode, isRunning]);

  // Show test results when available
  useEffect(() => {
    if (testResults) {
      setShowTestResult(true);
    }
  }, [testResults]);

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div className="flex items-center gap-3">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>

        <Button
          onClick={handleRunCode}
          disabled={isRunning}
          className="gap-2"
          size="sm"
        >
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {isRunning ? 'Running...' : 'Run'}
        </Button>
      </div>

      {/* Code Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          width="100%"
          language={language}
          theme="vs-dark"
          value={code || starterCode}
          onChange={handleCodeChange}
          options={editorOptions}
          keepCurrentModel={true} // Keep model for better performance
          loading={
            <div className="flex items-center justify-center h-full">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading editor...</span>
              </div>
            </div>
          }
          beforeMount={(monaco) => {
            // Optimize Monaco workers for better performance
            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true);
            monaco.languages.typescript.typescriptDefaults.setEagerModelSync(true);
            
            // Disable unnecessary features for performance
            monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: false,
              noSuggestionDiagnostics: true,
            });
            
            monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
              noSemanticValidation: true,
              noSyntaxValidation: false,
              noSuggestionDiagnostics: true,
            });
            
            // Configure compiler options for better performance
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
              target: monaco.languages.typescript.ScriptTarget.ES2020,
              allowNonTsExtensions: true,
              moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
              module: monaco.languages.typescript.ModuleKind.CommonJS,
              noEmit: true,
              esModuleInterop: true,
              jsx: monaco.languages.typescript.JsxEmit.React,
              reactNamespace: 'React',
              allowJs: true,
              typeRoots: ['node_modules/@types'],
            });
          }}
        />
      </div>

      {/* Test Case Panel */}
      <Collapsible open={showTestCase} onOpenChange={setShowTestCase}>
        <CollapsibleTrigger asChild>
          <div className="border-t bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <TestTube className="h-4 w-4" />
                <span>Testcase</span>
              </div>
              {showTestCase ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="bg-white dark:bg-gray-950 border-t">
            {question?.testCases && Array.isArray(question.testCases) && question.testCases.length > 0 ? (
              <div className="p-4">
                {/* Test case tabs */}
                <div className="flex gap-2 mb-4">
                  {question.testCases.slice(0, 3).map((_, index: number) => (
                    <button
                      key={index}
                      className="px-3 py-1 text-xs font-medium rounded bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Case {index + 1}
                    </button>
                  ))}
                </div>
                
                {/* Active test case */}
                <div className="space-y-4">
                  {question.testCases.slice(0, 1).map((testCase: any, index: number) => (
                    <div key={index} className="space-y-3">
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Input:
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
                          <code className="text-sm font-mono text-gray-900 dark:text-gray-100">
                            {Array.isArray(testCase.input) 
                              ? testCase.input.map((item: any, i: number) => (
                                  <div key={i}>
                                    <span className="text-blue-600 dark:text-blue-400">
                                      {Array.isArray(item) ? `[${item.join(', ')}]` : item}
                                    </span>
                                    {i < testCase.input.length - 1 && <br />}
                                  </div>
                                ))
                              : <span className="text-blue-600 dark:text-blue-400">{safeRender(testCase.input)}</span>
                            }
                          </code>
                        </div>
                      </div>
                      
                      <div>
                        <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2">
                          Expected Output:
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border">
                          <code className="text-sm font-mono text-green-600 dark:text-green-400">
                            {safeRender(testCase.expectedOutput)}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {question.testCases.length > 1 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2 border-t">
                      +{question.testCases.length - 1} more test cases will be used for evaluation
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                No test cases available
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Test Results Panel */}
      <Collapsible open={showTestResult} onOpenChange={setShowTestResult}>
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-between p-4 border-t bg-muted/20 hover:bg-muted/40"
          >
            <div className="flex items-center gap-2">
              <TestTube className="h-4 w-4" />
              <span className="font-medium">Test Result</span>
              {testResults && (
                <Badge 
                  variant={testResults.overallPassed ? "default" : "destructive"}
                  className="ml-2"
                >
                  {testResults.totalPassed}/{testResults.totalTests}
                </Badge>
              )}
            </div>
            {showTestResult ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t bg-muted/10 p-4 max-h-64 overflow-y-auto">
            {isRunning ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Running tests...</span>
                </div>
              </div>
            ) : testResults ? (
              <div className="space-y-3">
                {testResults.results.map((result: any, index: number) => (
                  <Card key={index} className={cn(
                    "bg-background border-l-4",
                    result.passed 
                      ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20" 
                      : "border-l-red-500 bg-red-50/50 dark:bg-red-950/20"
                  )}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                          {result.passed ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          Case {index + 1}
                        </CardTitle>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {result.executionTime || 0}ms
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-2">
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-medium">Input:</span>
                          <code className="ml-2 bg-muted px-1 py-0.5 rounded">
                            {safeRender(result.input)}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span>
                          <code className="ml-2 bg-green-100 dark:bg-green-950/30 px-1 py-0.5 rounded text-green-700 dark:text-green-300">
                            {safeRender(result.expectedOutput)}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Output:</span>
                          <code className={cn(
                            "ml-2 px-1 py-0.5 rounded",
                            result.passed 
                              ? "bg-green-100 dark:bg-green-950/30 text-green-700 dark:text-green-300"
                              : "bg-red-100 dark:bg-red-950/30 text-red-700 dark:text-red-300"
                          )}>
                            {safeRender(result.actualOutput)}
                          </code>
                        </div>
                        {result.error && (
                          <div>
                            <span className="font-medium text-red-600">Error:</span>
                            <code className="ml-2 bg-red-100 dark:bg-red-950/30 px-1 py-0.5 rounded text-red-700 dark:text-red-300 text-xs">
                              {result.error}
                            </code>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground text-sm py-8">
                Click "Run" to test your solution
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
});

export default LeetCodeCodePanel;
