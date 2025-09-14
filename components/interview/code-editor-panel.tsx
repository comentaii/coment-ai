'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Play, RotateCcw, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CodeEditorPanelProps {
  question: any;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', extension: 'js' },
  { value: 'python', label: 'Python', extension: 'py' },
  { value: 'java', label: 'Java', extension: 'java' },
  { value: 'cpp', label: 'C++', extension: 'cpp' },
  { value: 'typescript', label: 'TypeScript', extension: 'ts' },
];

const DEFAULT_THEMES = [
  { value: 'vs-dark', label: 'Dark' },
  { value: 'light', label: 'Light' },
  { value: 'hc-black', label: 'High Contrast' },
];

export function CodeEditorPanel({ 
  question, 
  onCodeChange, 
  onLanguageChange,
  className 
}: CodeEditorPanelProps) {
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [theme, setTheme] = useState('vs-dark');
  const [code, setCode] = useState('');
  const [pseudoCode, setPseudoCode] = useState('');
  const [fontSize, setFontSize] = useState(14);

  // Initialize code when question or language changes
  useEffect(() => {
    if (question?.starterCode && question.starterCode[selectedLanguage]) {
      const starterCode = question.starterCode[selectedLanguage];
      setCode(starterCode);
      onCodeChange(starterCode);
    }
  }, [question, selectedLanguage, onCodeChange]);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    onLanguageChange(language);
    
    // Update code with starter code for the new language
    if (question?.starterCode && question.starterCode[language]) {
      const starterCode = question.starterCode[language];
      setCode(starterCode);
      onCodeChange(starterCode);
    }
  };

  const handleCodeChange = (value: string | undefined) => {
    const newCode = value || '';
    setCode(newCode);
    onCodeChange(newCode);
  };

  const handleReset = () => {
    if (question?.starterCode && question.starterCode[selectedLanguage]) {
      const starterCode = question.starterCode[selectedLanguage];
      setCode(starterCode);
      onCodeChange(starterCode);
    }
  };

  const handleRunCode = () => {
    // TODO: Implement code execution
    console.log('Running code:', code);
  };

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header Controls */}
      <div className="flex items-center justify-between px-4 py-2 border-b bg-muted/30 shrink-0">
        <div className="flex items-center gap-3">
          <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-36 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_LANGUAGES.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger className="w-28 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {DEFAULT_THEMES.map((themeOption) => (
                <SelectItem key={themeOption.value} value={themeOption.value}>
                  {themeOption.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={fontSize.toString()} onValueChange={(value) => setFontSize(parseInt(value))}>
            <SelectTrigger className="w-16 h-8 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[12, 14, 16, 18, 20].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2 h-8"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button
            size="sm"
            onClick={handleRunCode}
            className="gap-2 h-8"
          >
            <Play className="h-3 w-3" />
            Run
          </Button>
        </div>
      </div>

      {/* Editor Tabs */}
      <Tabs defaultValue="code" className="flex-1 flex flex-col min-h-0">
        <TabsList className="grid w-full grid-cols-2 mx-4 mt-2 shrink-0">
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="pseudo">Pseudo Code</TabsTrigger>
        </TabsList>

        <TabsContent value="code" className="flex-1 m-0 p-0">
          <div className="h-full w-full">
            <Editor
              height="100%"
              width="100%"
              language={selectedLanguage}
              theme={theme}
              value={code}
              onChange={handleCodeChange}
              loading={<div className="flex items-center justify-center h-full">Loading editor...</div>}
              options={{
                minimap: { enabled: true },
                fontSize: fontSize,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'off',
                contextmenu: true,
                selectOnLineNumbers: true,
                glyphMargin: true,
                folding: true,
                foldingHighlight: true,
                showFoldingControls: 'mouseover',
                bracketPairColorization: {
                  enabled: true
                },
                guides: {
                  bracketPairs: true,
                  indentation: true
                },
                suggest: {
                  enabled: true
                },
                quickSuggestions: {
                  other: true,
                  comments: true,
                  strings: true
                },
                acceptSuggestionOnCommitCharacter: true,
                acceptSuggestionOnEnter: 'on',
                accessibilitySupport: 'auto',
                autoIndent: 'full',
                codeLens: false,
                colorDecorators: true,
                dragAndDrop: true,
                find: {
                  autoFindInSelection: 'never',
                  seedSearchStringFromSelection: 'always'
                },
                formatOnPaste: true,
                formatOnType: false,
                hover: {
                  enabled: true
                },
                lightbulb: {
                  enabled: true
                },
                links: true,
                mouseWheelZoom: true,
                multiCursorModifier: 'alt',
                occurrencesHighlight: true,
                renderWhitespace: 'selection',
                selectionHighlight: true,
                smoothScrolling: true,
                suggestOnTriggerCharacters: true,
                wordBasedSuggestions: true,
                wrappingIndent: 'indent',
                scrollbar: {
                  vertical: 'auto',
                  horizontal: 'auto'
                }
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="pseudo" className="flex-1 m-0 p-0">
          <div className="h-full p-4">
            <textarea
              value={pseudoCode}
              onChange={(e) => setPseudoCode(e.target.value)}
              placeholder="Write your pseudo code here...&#10;&#10;Example:&#10;1. Initialize empty hash map&#10;2. For each number in array:&#10;   a. Calculate complement = target - number&#10;   b. If complement exists in hash map:&#10;      - Return [hash_map[complement], current_index]&#10;   c. Add number and index to hash map&#10;3. Return empty array if no solution found"
              className="w-full h-full resize-none focus:outline-none focus:ring-2 focus:ring-ring font-mono text-sm bg-background border-0 p-4"
              style={{ fontSize: `${fontSize}px` }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
