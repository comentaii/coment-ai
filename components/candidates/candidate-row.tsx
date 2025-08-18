'use client';

import { PopulatedCandidateProfile } from '@/services/api/candidateApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Bot, Briefcase, AlertTriangle } from 'lucide-react';
import { useDeleteCandidateMutation } from '@/services/api/candidateApi';
import { toast } from 'sonner';

interface CandidateRowProps {
  candidate: PopulatedCandidateProfile;
}

const getStatusClasses = (status: PopulatedCandidateProfile['status']) => {
    switch (status) {
      case 'analyzed':
        return { icon: <Bot className="h-4 w-4 text-green-500" />, text: 'Analyzed' };
      case 'pending_analysis':
        return { icon: <Briefcase className="h-4 w-4 text-gray-500" />, text: 'Pending Analysis' };
      case 'error':
        return { icon: <AlertTriangle className="h-4 w-4 text-red-500" />, text: 'Error' };
      default:
        return { icon: null, text: '' };
    }
};

export function CandidateRow({ candidate }: CandidateRowProps) {
  const { userId, analysisResult, status, cvPath, _id } = candidate;
  const statusInfo = getStatusClasses(status);
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
    if (window.confirm(`Are you sure you want to delete the profile for ${userId?.name}?`)) {
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
        <div className="flex items-center justify-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-500">
            <AlertTriangle className="h-5 w-5 mr-3" />
            Invalid candidate data: Associated user could not be found.
        </div>
    )
  }

  return (
    <div className="flex items-center p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4 flex-1">
        <Avatar>
          <AvatarImage src={userId.image || ''} alt={userId.name} />
          <AvatarFallback>{userId.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{userId.name}</p>
          <p className="text-sm text-muted-foreground truncate">{userId.email}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 mx-4 w-1/4">
        {statusInfo.icon}
        <span className="text-sm">{statusInfo.text}</span>
      </div>

      <div className="w-1/4">
        {analysisResult && (
            <Badge variant="outline">{analysisResult.experienceLevel}</Badge>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePreview}>
            <Eye className="h-4 w-4" />
        </Button>
        <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
            <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
