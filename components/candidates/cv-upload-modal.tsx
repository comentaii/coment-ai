'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CvUploader } from '@/components/forms/cv-uploader';
import { Upload } from 'lucide-react';
import { useGetCompanyCandidatesQuery } from '@/services/api/candidateApi';

export function CvUploadModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { refetch } = useGetCompanyCandidatesQuery();

  const handleUploadComplete = () => {
    setIsOpen(false);
    // Refetch candidates data to update the list
    refetch();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload CVs
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload CVs</DialogTitle>
          <DialogDescription>
            Upload single or multiple CVs in PDF format. They will be automatically analyzed.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <CvUploader onUploadComplete={handleUploadComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
