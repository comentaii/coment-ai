'use client';

import React from 'react';
import ChallengePanel from './challenge-panel';
import CodeEditor from './code-editor';
import { IInterview } from '@/schemas';

interface InterviewLayoutProps {
  interview: IInterview & { userRole: 'candidate' | 'interviewer' };
}

const InterviewLayout: React.FC<InterviewLayoutProps> = ({ interview }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* Sol Panel: Soru Detayları */}
      <div className="w-1/3 h-full p-4 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <ChallengePanel challenge={interview.challenge} />
      </div>

      {/* Sağ Panel: Kod Editörü */}
      <div className="w-2/3 h-full flex flex-col">
        <CodeEditor challenge={interview.challenge} />
      </div>
    </div>
  );
};

export default InterviewLayout;
