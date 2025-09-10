import { InterviewScreenLayout } from '@/components/interview/interview-screen-layout';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coding Interview - Coment AI',
  description: 'Practice coding interviews with AI-generated questions',
};

export default function InterviewScreenPage() {
  return (
    <InterviewScreenLayout />
  );
}
