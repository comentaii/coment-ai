'use client';

import React from 'react';
import { IChallenge } from '@/schemas';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ChallengePanelProps {
  challenge: IChallenge;
}

const difficultyVariantMap = {
  Easy: 'default',
  Medium: 'secondary',
  Hard: 'destructive',
};

const ChallengePanel: React.FC<ChallengePanelProps> = ({ challenge }) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
            <CardTitle className="text-2xl font-bold">{challenge.title}</CardTitle>
            <Badge variant={difficultyVariantMap[challenge.difficulty] || 'default'}>
                {challenge.difficulty}
            </Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div 
            className="prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: challenge.description }} 
        />
      </CardContent>
    </Card>
  );
};

export default ChallengePanel;
