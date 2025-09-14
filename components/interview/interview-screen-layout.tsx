'use client';

import { useState, useEffect } from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LeetCodeQuestionPanel } from './leetcode-question-panel';
import LeetCodeCodePanel from './leetcode-code-panel';
import { Separator } from '@/components/ui/separator';
import { Clock, RefreshCw, Send, Settings, Code } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGenerateQuestionMutation } from '@/services/api/questionApi';
import { useExecuteCodeMutation } from '@/services/api/codeExecutionApi';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

interface InterviewScreenLayoutProps {
  initialQuestion?: any;
  className?: string;
}

export function InterviewScreenLayout({ 
  initialQuestion,
  className 
}: InterviewScreenLayoutProps) {
  const [question, setQuestion] = useState(initialQuestion);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [topic, setTopic] = useState('algorithms');
  const [testResults, setTestResults] = useState<any>(null);
  
  const [generateQuestion, { isLoading: isGenerating }] = useGenerateQuestionMutation();
  const [executeCode, { isLoading: isExecuting }] = useExecuteCodeMutation();
  const { success, error } = useToast();

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generateNewQuestion = async (customDifficulty?: string, customTopic?: string) => {
    try {
      const selectedDifficulty = customDifficulty || difficulty;
      const selectedTopic = customTopic || topic;
      
      console.log('Generating question with params:', { 
        difficulty: selectedDifficulty, 
        topic: selectedTopic, 
        programmingLanguage: language 
      });
      
      const response = await generateQuestion({
        difficulty: selectedDifficulty as 'easy' | 'medium' | 'hard',
        topic: selectedTopic,
        programmingLanguage: language,
      }).unwrap();
      
      console.log('Question generation response:', response);
      
      if (response && response.question) {
        setQuestion(response.question);
        success('New question generated successfully!');
      } else {
        console.error('Invalid response structure:', response);
        error('Invalid response from server');
      }
    } catch (err) {
      console.error('Error generating question:', err);
      error('Failed to generate question. Please try again.');
    }
  };

  const handleRunCode = async () => {
    if (!question || !code.trim()) {
      error('Please write some code first');
      return;
    }

    if (!question.testCases || !Array.isArray(question.testCases)) {
      error('No test cases available for this question');
      return;
    }

    try {
      const result = await executeCode({
        code: code.trim(),
        language,
        testCases: question.testCases.map((testCase: any) => ({
          input: testCase.input,
          expectedOutput: testCase.expectedOutput
        }))
      }).unwrap();

      setTestResults(result);
      
      if (result.overallPassed) {
        success(`All tests passed! (${result.totalPassed}/${result.totalTests})`);
      } else {
        error(`${result.totalPassed}/${result.totalTests} tests passed`);
      }
    } catch (err) {
      console.error('Code execution error:', err);
      error('Failed to execute code. Please try again.');
      setTestResults(null);
    }
  };

  const handleSubmitSolution = () => {
    // TODO: Implement solution submission
    console.log('Submitting solution:', { code, language, testResults });
  };

  // Generate initial question if none provided
  useEffect(() => {
    if (!question) {
      generateNewQuestion();
    }
  }, []);

  return (
    <div className={cn('h-screen flex flex-col bg-background overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-background to-muted/30 shrink-0 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Code className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground hidden sm:block">Coding Interview</h1>
              <h1 className="text-lg font-bold text-foreground sm:hidden">Interview</h1>
              {question && (
                <div className="flex items-center gap-2 mt-1 hidden md:flex">
                  <Badge className={cn(getDifficultyColor(question.difficulty), "text-xs")}>
                    {question.difficulty.toUpperCase()}
                  </Badge>
                  {question.topic && (
                    <Badge variant="secondary" className="text-xs">
                      {question.topic.toUpperCase()}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Question Settings - Hidden on mobile */}
          <div className="hidden lg:flex items-center gap-2">
            <Select value={difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setDifficulty(value)}>
              <SelectTrigger className="w-24 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="algorithms">Algorithms</SelectItem>
                <SelectItem value="data-structures">Data Structures</SelectItem>
                <SelectItem value="system-design">System Design</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 text-sm bg-muted/50 px-3 py-2 rounded-lg">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono font-semibold text-foreground">{formatTime(timeElapsed)}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => generateNewQuestion()}
            disabled={isGenerating}
            className="gap-2 hidden sm:flex hover:bg-blue-50 dark:hover:bg-blue-950/20 border-blue-200 dark:border-blue-800"
          >
            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
            New Question
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => generateNewQuestion()}
            disabled={isGenerating}
            className="sm:hidden hover:bg-blue-50 dark:hover:bg-blue-950/20"
          >
            <RefreshCw className={cn("h-4 w-4", isGenerating && "animate-spin")} />
          </Button>

          <Button
            size="sm"
            onClick={handleSubmitSolution}
            className="gap-2 hidden sm:flex bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
            Submit
          </Button>

          <Button
            size="sm"
            onClick={handleSubmitSolution}
            className="sm:hidden bg-green-600 hover:bg-green-700 text-white"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-0">
        {/* Desktop Layout - LeetCode Style */}
        <div className="hidden md:block h-full">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel defaultSize={45} minSize={35} maxSize={60}>
              <LeetCodeQuestionPanel question={question} className="h-full" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={55} minSize={40}>
              <LeetCodeCodePanel
                question={question}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onRunCode={handleRunCode}
                isRunning={isExecuting}
                testResults={testResults}
                className="h-full"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Mobile Layout - Vertical */}
        <div className="md:hidden h-full">
          <ResizablePanelGroup direction="vertical" className="h-full">
            <ResizablePanel defaultSize={40} minSize={30} maxSize={50}>
              <LeetCodeQuestionPanel question={question} className="h-full" />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={50}>
              <LeetCodeCodePanel
                question={question}
                onCodeChange={setCode}
                onLanguageChange={setLanguage}
                onRunCode={handleRunCode}
                isRunning={isExecuting}
                testResults={testResults}
                className="h-full"
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </div>

      {/* Footer Status */}
      <div className="flex items-center justify-between px-6 py-3 border-t bg-muted/20 text-sm shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-muted-foreground">
              Language: <span className="font-semibold text-foreground capitalize">{language}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-muted-foreground">
              Lines: <span className="font-semibold text-foreground">{code.split('\n').length}</span>
            </span>
          </div>
          <div className="flex items-center gap-2 hidden sm:flex">
            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
            <span className="text-muted-foreground">
              Characters: <span className="font-semibold text-foreground">{code.length}</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 dark:text-green-300 font-medium">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
