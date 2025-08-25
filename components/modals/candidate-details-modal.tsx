'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PopulatedCandidateProfile } from '@/services/api/candidateApi';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, User, Briefcase, GraduationCap, Lightbulb, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CandidateDetailsModalProps {
  candidate?: PopulatedCandidateProfile;
  isOpen: boolean;
  onClose: () => void;
}

const AnalysisSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary mt-1">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-lg text-foreground">{title}</h3>
      <div className="mt-1 text-muted-foreground">{children}</div>
    </div>
  </div>
);

const SkillBadge: React.FC<{ skill: string }> = ({ skill }) => (
  <Badge variant="secondary" className="text-sm font-medium">
    {skill}
  </Badge>
);

export function CandidateDetailsModal({
  candidate,
  isOpen,
  onClose,
}: CandidateDetailsModalProps) {
  if (!candidate || !candidate.analysisResult) {
    return null;
  }

  const { analysisResult, userId: user, cvPath } = candidate;
  const { fullName, summary, skills, experienceLevel } = analysisResult;

  const experienceColors = {
    Junior: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    'Mid-level': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300',
    Senior: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300',
    Lead: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300',
    Unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="w-6 h-6 text-primary" />
            <span>{fullName}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-2">
            <span>{user.email}</span>
            <Badge className={cn("text-base", experienceColors[experienceLevel])}>
              <GraduationCap className="w-4 h-4 mr-2" />
              {experienceLevel}
            </Badge>
          </DialogDescription>
        </DialogHeader>
        <div className="py-6 space-y-6">
          <AnalysisSection icon={<FileText className="w-5 h-5" />} title="AI Summary">
            <p>{summary}</p>
          </AnalysisSection>

          <AnalysisSection icon={<Lightbulb className="w-5 h-5" />} title="Key Skills">
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} />
              ))}
            </div>
          </AnalysisSection>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => window.open(cvPath, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Preview Original CV
          </Button>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
