'use client';

import { useState } from 'react';
import { PopulatedCandidateProfile } from '@/services/api/candidateApi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Bot, Briefcase, AlertTriangle, MoreHorizontal } from 'lucide-react';
import { useDeleteCandidateMutation } from '@/services/api/candidateApi';
import { toast } from 'sonner';
import { CandidateDetailsModal } from '@/components/modals/candidate-details-modal';
import { useConfirmation } from '@/hooks/use-confirmation'; // Import the new hook

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
  const { userId, analysisResult, status, _id } = candidate;
  const statusInfo = getStatusClasses(status);
  const [deleteCandidate, { isLoading: isDeleting }] = useDeleteCandidateMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { confirm } = useConfirmation(); // Use the hook
  
  const handleDelete = async () => {
    const isConfirmed = await confirm(
      'Delete Candidate',
      `Are you sure you want to delete the profile for ${userId?.name}? This action cannot be undone.`
    );

    if (isConfirmed) {
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
    <>
      <div className="flex items-center p-3 bg-card border rounded-lg hover:bg-muted/50 transition-colors w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <Avatar>
            <AvatarImage src={userId.image || ''} alt={userId.name} />
            <AvatarFallback>{userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate">{userId.name}</p>
            <p className="text-sm text-muted-foreground truncate">{userId.email}</p>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-2 justify-center flex-1">
          {statusInfo.icon}
          <span className="text-sm">{statusInfo.text}</span>
        </div>

        <div className="hidden lg:flex justify-center flex-1">
          {analysisResult && (
              <Badge variant="outline">{analysisResult.experienceLevel}</Badge>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 flex-shrink-0 ml-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsModalOpen(true)}
            disabled={status !== 'analyzed'}
          >
              <MoreHorizontal className="h-4 w-4 mr-2" />
              View Details
          </Button>
          <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isDeleting}>
              <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <CandidateDetailsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        candidate={candidate}
      />
    </>
  );
}
