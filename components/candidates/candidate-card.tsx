'use client';

import { PopulatedCandidateProfile } from '@/services/api/candidateApi';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Briefcase, Bot, AlertTriangle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeleteCandidateMutation } from '@/services/api/candidateApi';
import { toast } from 'sonner';

interface CandidateCardProps {
  candidate: PopulatedCandidateProfile;
}

const getStatusBadgeVariant = (status: PopulatedCandidateProfile['status']) => {
  switch (status) {
    case 'analyzed':
      return 'success';
    case 'pending_analysis':
      return 'secondary';
    case 'error':
      return 'destructive';
    default:
      return 'default';
  }
};

const getStatusIcon = (status: PopulatedCandidateProfile['status']) => {
    switch (status) {
        case 'analyzed':
            return <Bot className="h-4 w-4 mr-2" />;
        case 'pending_analysis':
            return <Briefcase className="h-4 w-4 mr-2" />;
        case 'error':
            return <AlertTriangle className="h-4 w-4 mr-2" />;
        default:
            return null;
    }
}

export function CandidateCard({ candidate }: CandidateCardProps) {
  const { userId, analysisResult, status, cvPath, _id } = candidate;
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();

  const handlePreview = () => {
    if (cvPath) {
      // Find the part of the path that starts with 'uploads'
      const uploadsMarker = '/uploads/';
      const pathSeparator = cvPath.includes('\\') ? '\\uploads\\' : uploadsMarker;
      
      const uploadsIndex = cvPath.lastIndexOf(pathSeparator);
      
      if (uploadsIndex !== -1) {
        // Get the path relative to the uploads directory (e.g., 'companyId/file.pdf')
        const relativePath = cvPath.substring(uploadsIndex + pathSeparator.length);
        const apiPath = `/api/cv/${relativePath}`;
        window.open(apiPath, '_blank');
      } else {
        toast.error("Invalid CV path format. Cannot generate preview link.");
      }
    } else {
      toast.error("CV path is not available.");
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete this profile?`)) {
        try {
            await deleteCandidate(_id).unwrap();
            toast.success("Candidate deleted successfully.");
        } catch (error) {
            toast.error("Failed to delete candidate.");
        }
    }
  };

  if (!userId) {
    return (
        <Card className="flex flex-col h-full items-center justify-center bg-red-50 dark:bg-red-900/20 p-4">
            <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                Invalid Candidate Data
            </p>
            <p className="text-xs text-center text-red-500 dark:text-red-500/80">
                Associated user could not be found for this profile.
            </p>
            <Button variant="destructive" size="sm" className="mt-4" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Profile
            </Button>
        </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="h-full" // Ensure the motion div takes full height
    >
      <Card className="flex flex-col h-full">
        <CardHeader className="flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={userId.image || ''} alt={userId.name} />
            <AvatarFallback>{userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <CardTitle className="text-lg">{userId.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{userId.email}</p>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="space-y-3">
            <div className="flex items-center">
              {getStatusIcon(status)}
              <Badge variant={getStatusBadgeVariant(status)} className="capitalize">
                {status.replace('_', ' ')}
              </Badge>
            </div>
            {analysisResult && (
              <div className="flex items-center text-sm">
                <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{analysisResult.experienceLevel}</span>
              </div>
            )}
            {analysisResult && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {analysisResult.summary}
                </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex items-center gap-2 mt-auto pt-4">
            <Button variant="outline" className="w-full" onClick={handlePreview} disabled={!cvPath}>
                <Eye className="h-4 w-4 mr-2" />
                Preview CV
            </Button>
            <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
                <Trash2 className="h-4 w-4 text-white" />
            </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
