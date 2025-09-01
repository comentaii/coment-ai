'use client';
import { PopulatedCandidateProfile } from '@/services/api/candidateApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { User, Mail, Tag, CheckCircle, ChevronDown, MessageSquareQuote } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { useState } from 'react';

type MatchedCandidate = PopulatedCandidateProfile & {
  matchScore?: number;
  matchExplanation?: string;
  matchedSkills?: string[];
  // Yeni API'den gelen veri yapısı için
  analysisResult?: {
    fullName?: string;
    contactInfo?: {
      email?: string;
      phone?: string;
    };
    experienceLevel?: string;
    summary?: string;
    technicalSkills?: string[];
  };
};

interface CandidateMatchCardProps {
  candidate: MatchedCandidate;
}

export function CandidateMatchCard({ candidate }: CandidateMatchCardProps) {
  const { userId, analysisResult, matchScore = 0, matchExplanation } = candidate;

  return (
    <Card className="transform transition-all duration-300 hover:shadow-lg flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-md font-medium flex items-center">
            <User className="w-5 h-5 mr-2 text-gray-500 dark:text-gray-400"/>
            {userId?.name || analysisResult?.fullName || 'İsim Belirtilmemiş'}
        </CardTitle>
        <Badge 
          className={`font-bold ${
            matchScore > 75 ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 
            matchScore > 40 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300' : 
            'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300'
          }`}
        >
          %{matchScore.toFixed(0)} Uyum
        </Badge>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center mb-4">
            <Mail className="w-4 h-4 mr-2"/>
            {userId?.email || analysisResult?.contactInfo?.email || 'Email Belirtilmemiş'}
        </div>

        <div>
            <div className="flex justify-between items-center mb-1">
                <h4 className="text-sm font-semibold">Uyum Oranı</h4>
                <p className="text-sm font-bold">{matchScore.toFixed(0)}%</p>
            </div>
            <Progress value={matchScore} className="h-2" />
        </div>

        {analysisResult?.experienceLevel && (
             <div className="mt-4 text-sm flex items-center">
                <Tag className="w-4 h-4 mr-2 text-gray-500 dark:text-gray-400"/>
                <span className="font-semibold mr-2">Seviye:</span>
                <span>{analysisResult.experienceLevel}</span>
            </div>
        )}
      </CardContent>
      
      {matchExplanation && (
        <Accordion type="single" collapsible className="w-full text-sm">
          <AccordionItem value="item-1" className="border-t">
            <AccordionTrigger className="px-6 py-3 hover:no-underline">
              <div className="flex items-center font-semibold">
                <MessageSquareQuote className="w-4 h-4 mr-2"/>
                AI Değerlendirmesi
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 text-gray-600 dark:text-gray-400">
              {matchExplanation}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      )}
    </Card>
  );
}
