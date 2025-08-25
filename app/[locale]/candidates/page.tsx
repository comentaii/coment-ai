'use client';
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CvUploader } from '@/components/forms/cv-uploader';
import { RBACGuard } from '@/components/ui/rbac-guard';
import { GenericList } from '@/components/ui/generic-list';
import { CandidateCard } from '@/components/candidates/candidate-card';
import { useGetCompanyCandidatesQuery } from '@/services/api/candidateApi';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CandidateRow } from '@/components/candidates/candidate-row';
import { CvUploadModal } from '@/components/candidates/cv-upload-modal';

type ViewMode = 'grid' | 'list';

function CandidateList() {
  const { data: candidates, isLoading, isError } = useGetCompanyCandidatesQuery();
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Intelligent Empty State: Show uploader if no candidates exist and not loading
  if (!isLoading && (!candidates || candidates.length === 0)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Upload Your First CVs</CardTitle>
          <CardDescription>
            Your candidate pool is empty. Upload CVs to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CvUploader />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Candidate Pool</CardTitle>
          <CardDescription>
            Browse and manage all candidates in your company's talent pool.
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('grid')}
            className={cn(viewMode === 'grid' ? 'bg-brand-green hover:bg-brand-green/90' : '')}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="icon"
            onClick={() => setViewMode('list')}
            className={cn(viewMode === 'list' ? 'bg-brand-green hover:bg-brand-green/90' : '')}
          >
            <List className="h-4 w-4" />
          </Button>
          <CvUploadModal />
        </div>
      </CardHeader>
      <CardContent>
        <GenericList
          data={candidates || []}
          isLoading={isLoading}
          isError={isError}
          renderItem={(candidate) =>
            viewMode === 'grid' ? (
              <CandidateCard candidate={candidate} />
            ) : (
              <CandidateRow candidate={candidate} />
            )
          }
          className={cn(
            viewMode === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
              : "space-y-2"
          )}
          skeletonComponent={
            viewMode === 'grid' ? (
              <Skeleton className="h-64 w-full rounded-lg" />
            ) : (
              <Skeleton className="h-16 w-full rounded-lg" />
            )
          }
          skeletonCount={8}
          // The empty state is now handled by the logic at the top of the component
          emptyState={<></>}
        />
      </CardContent>
    </Card>
  );
}

export default function CandidatesPage() {
  return (
    <DashboardLayout>
      <RBACGuard
        requiredRoles={['hr_manager', 'super_admin']}
        fallback={<p className="p-6">You do not have permission to access this page.</p>}
      >
        <div className="p-4 sm:p-6 lg:p-8 space-y-6">
          <CandidateList />
        </div>
      </RBACGuard>
    </DashboardLayout>
  );
}
