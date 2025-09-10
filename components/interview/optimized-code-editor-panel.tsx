'use client';

import { useState, useCallback, useMemo, memo, useRef } from 'react';
import { Editor } from '@monaco-editor/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  RotateCcw, 
  Settings, 
  Type,
  Palette,
  ZoomIn,
  ZoomOut,
  Code,
  FileText,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorPanelProps {
  question?: any;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onRunCode: () => void;
  isRunning?: boolean;
  className?: string;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '🟨' },
  { value: 'python', label: 'Python', icon: '🐍' },
  { value: 'java', label: 'Java', icon: '☕' },
  { value: 'cpp', label: 'C++', icon: '⚡' },
] as const;

const THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast' },
] as const;

// Memoized pseudo code component for better performance
const PseudoCodeEditor = memo(({ value, onChange, fontSize }: { 
  value: string; 
  onChange: (value: string) => void; 
  fontSize: number; 
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const placeholder = useMemo(() => `Write your pseudo code here...

Example:
1. Initialize empty hash map
2. For each number in array:
   a. Calculate complement = target - number
   b. If complement exists in hash map:
      - Return [hash_map[complement], current_index]
   c. Add number and index to hash map
3. Return empty array if no solution found`, []);

  return (
    <div className="h-full p-4">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full h-full resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm bg-background border-0 p-4"
        style={{ fontSize: `${fontSize}px` }}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
});

PseudoCodeEditor.displayName = 'PseudoCodeEditor';

export const CodeEditorPanel = memo(function CodeEditorPanel({ 
  question, 
  onCodeChange, 
  onLanguageChange,
  onRunCode,
  isRunning = false,
  className 
}: CodeEditorPanelProps) {
  const [code, setCode] = useState<string>('');
  const [pseudoCode, setPseudoCode] = useState<string>('');
  const [language, setLanguage] = useState<string>('javascript');
  const [theme, setTheme] = useState<string>('vs-dark');
  const [fontSize, setFontSize] = useState<number>(14);
  const [activeTab, setActiveTab] = useState<string>('code');
  
  // Memoized editor options for performance
  const editorOptions = useMemo(() => ({
    minimap: { enabled: true },
    fontSize,
    fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
    lineNumbers: 'on' as const,
    roundedSelection: false,
    scrollBeyondLastLine: false,
    automaticLayout: true,
    wordWrap: 'off' as const,
    folding: true,
    foldingHighlight: true,
    foldingImportsByDefault: false,
    unfoldOnClickAfterEndOfLine: false,
    showFoldingControls: 'mouseover' as const,
    dragAndDrop: true,
    links: true,
    mouseWheelZoom: true,
    multiCursorModifier: 'alt' as const,
    occurrencesHighlight: true,
    renderWhitespace: 'selection' as const,
    selectionHighlight: true,
    smoothScrolling: true,
    suggestOnTriggerCharacters: true,
    wordBasedSuggestions: true,
    wrappingIndent: 'indent' as const,
    scrollbar: {
      vertical: 'auto' as const,
      horizontal: 'auto' as const,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10,
      verticalSliderSize: 10,
      horizontalSliderSize: 10,
    },
    contextmenu: true,
    copyWithSyntaxHighlighting: true,
    find: {
      addExtraSpaceOnTop: false,
      autoFindInSelection: 'never' as const,
      seedSearchStringFromSelection: 'always' as const,
    },
  }), [fontSize]);

  // Memoized starter code based on language and question
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
    // Your solution here
};`,
      python: `def two_sum(nums, target):
    """
    :type nums: List[int]
    :type target: int
    :rtype: List[int]
    """
    # Your solution here
    pass`,
      java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Your solution here
        return new int[0];
    }
}`,
      cpp: `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Your solution here
        return {};
    }
};`
    };
    
    return templates[language as keyof typeof templates] || '';
  }, [question, language]);

  // Optimized change handlers
  const handleCodeChange = useCallback((value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(newCode);
  }, [onCodeChange]);

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
    // Reset code to starter code for new language
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
    }
  }, [onRunCode, isRunning]);

  // Character and line count
  const stats = useMemo(() => {
    const lines = activeTab === 'code' ? code.split('\n').length : pseudoCode.split('\n').length;
    const chars = activeTab === 'code' ? code.length : pseudoCode.length;
    return { lines, chars };
  }, [code, pseudoCode, activeTab]);

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-3 border-b bg-muted/50 space-y-3">
        {/* Top Row - Language, Theme, Font Size */}
        <div className="flex items-center gap-3 text-sm">
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  <div className="flex items-center gap-2">
                    <span>{lang.icon}</span>
                    <span>{lang.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {THEMES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setFontSize(Math.max(10, fontSize - 1))}
            >
              <ZoomOut className="h-3 w-3" />
            </Button>
            <span className="text-xs min-w-[2rem] text-center">{fontSize}px</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setFontSize(Math.min(24, fontSize + 1))}
            >
              <ZoomIn className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Bottom Row - Actions */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              onClick={handleRunCode}
              disabled={isRunning}
              className="h-8 gap-2"
              size="sm"
            >
              {isRunning ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="h-8 gap-2"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </Button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-3 w-3" />
              {stats.lines} lines
            </div>
            <div className="flex items-center gap-1">
              <Type className="h-3 w-3" />
              {stats.chars} chars
            </div>
          </div>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="flex-1 flex flex-col min-h-0"
      >
        <TabsList className="grid w-full grid-cols-2 rounded-none border-b bg-muted/30">
          <TabsTrigger value="code" className="gap-2">
            <Code className="h-4 w-4" />
            Code
          </TabsTrigger>
          <TabsTrigger value="pseudo" className="gap-2">
            <FileText className="h-4 w-4" />
            Pseudo Code
          </TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0 p-0 min-h-0">
          <div className="h-full">
            <Editor
              height="100%"
              width="100%"
              language={language}
              theme={theme}
              value={code || starterCode}
              onChange={handleCodeChange}
              options={editorOptions}
              loading={
                <div className="flex items-center justify-center h-full">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading editor...</span>
                  </div>
                </div>
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="pseudo" className="flex-1 m-0 p-0 min-h-0">
          <PseudoCodeEditor
            value={pseudoCode}
            onChange={setPseudoCode}
            fontSize={fontSize}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
});

export default CodeEditorPanel;
