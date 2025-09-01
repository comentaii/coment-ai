'use client';

import React from 'react';
import Editor from '@monaco-editor/react';
import { IChallenge } from '@/schemas';
import { useTheme } from 'next-themes';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface CodeEditorProps {
  challenge: IChallenge;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ challenge }) => {
  const { theme } = useTheme();

  return (
    <Card className="h-full w-full flex flex-col p-2">
       <Editor
        height="100%"
        language="javascript" // veya challenge.language
        value={challenge.starterCode}
        theme={theme === 'dark' ? 'vs-dark' : 'light'}
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          contextmenu: false,
        }}
        loading={<Skeleton className="h-full w-full" />}
      />
    </Card>
  );
};

export default CodeEditor;
