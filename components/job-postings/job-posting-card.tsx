'use client';

import { IJobPosting } from '@/schemas/job-posting.model';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Calendar, Tag, MoreVertical, Trash2, Power, PowerOff } from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteJobPostingMutation, useUpdateJobPostingMutation } from '@/services/api/job-posting-api';
import { useConfirmation } from '@/hooks/use-confirmation';
import { useToast } from '@/hooks/use-toast';

interface JobPostingCardProps {
  jobPosting: IJobPosting;
}

export function JobPostingCard({ jobPosting }: JobPostingCardProps) {
  const locale = useLocale();
  const t = useTranslations('JobPostingCard');
  const { title, description, skills, status, createdAt, _id } = jobPosting;
  const [deleteJobPosting, { isLoading: isDeleting }] = useDeleteJobPostingMutation();
  const [updateJobPosting, { isLoading: isUpdating }] = useUpdateJobPostingMutation();
  const { confirm } = useConfirmation();
  const { promise } = useToast();

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: t('deleteConfirm.title'),
      description: t('deleteConfirm.description', { title }),
      confirmText: t('deleteConfirm.confirmText'),
      cancelText: t('deleteConfirm.cancelText'),
    });

    if (isConfirmed) {
      await promise(deleteJobPosting(_id).unwrap(), {
        loading: t('toast.deleting'),
        success: t('toast.deletedSuccess', { title }),
        error: (err) => err.data?.message || t('toast.deletedError'),
      });
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = status === 'open' ? 'closed' : 'open';
    await promise(
      updateJobPosting({ id: _id, body: { status: newStatus } }).unwrap(),
      {
        loading: t('toast.updating'),
        success: t('toast.updatedSuccess', { title }),
        error: (err) => err.data?.message || t('toast.updatedError'),
      }
    );
  };

  const statusMap: { [key: string]: { text: string, className: string } } = {
    open: { text: t('status.open'), className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    closed: { text: t('status.closed'), className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' },
    archived: { text: t('status.archived'), className: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200' },
  };

  return (
    <Card className="flex flex-col h-full transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-green-900/50">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 pr-2">{title}</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={statusMap[status]?.className || statusMap.open.className}>
              {statusMap[status]?.text || status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" disabled={isDeleting || isUpdating}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleToggleStatus}>
                  {status === 'open' ? (
                    <><PowerOff className="mr-2 h-4 w-4" /> {t('actions.close')}</>
                  ) : (
                    <><Power className="mr-2 h-4 w-4" /> {t('actions.open')}</>
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-red-500 focus:text-red-500">
                  <Trash2 className="mr-2 h-4 w-4" />
                  {t('actions.delete')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 pt-2 flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          {t('createdAt')}: {new Date(createdAt).toLocaleDateString(locale)}
        </p>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{description}</p>
        <div className="mt-4">
          <h4 className="text-sm font-semibold mb-2 flex items-center"><Tag className="w-4 h-4 mr-2" /> {t('skills')}</h4>
          <div className="flex flex-wrap gap-2">
            {skills.slice(0, 4).map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
            {skills.length > 4 && <Badge variant="outline">+{skills.length - 4} {t('more')}</Badge>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Button asChild className="w-full">
          <Link href={`/${locale}/job-postings/${_id}`}>
            {t('viewDetails')} <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function JobPostingCardSkeleton() {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/4" />
        </div>
        <Skeleton className="h-4 w-1/2 mt-2" />
      </CardHeader>
      <CardContent className="flex-grow">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full mt-2" />
        <Skeleton className="h-4 w-5/6 mt-2" />
        <div className="mt-4">
          <Skeleton className="h-5 w-1/3 mb-2" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-6 w-1/5" />
            <Skeleton className="h-6 w-1/3" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto pt-4">
        <Skeleton className="h-10 w-full" />
      </CardFooter>
    </Card>
  );
}
