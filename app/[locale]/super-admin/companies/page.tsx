'use client';

import { useState } from 'react';
import {
  useGetAllCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation
} from '@/services/api/companyApi';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import { ICompany } from '@/schemas/company.model';
import { useTranslations } from 'next-intl';
import { CompanyFormModal } from '@/components/personnel/company-form-modal';
import { CompanyFormData } from '@/lib/validation-schemas';
import { useToast } from '@/hooks/use-toast';

function getSubscriptionPlanVariant(plan: ICompany['subscriptionPlan']) {
  switch (plan) {
    case 'premium':
      return 'secondary';
    case 'enterprise':
      return 'default';
    case 'basic':
    default:
      return 'outline';
  }
}

export default function CompanyManagementPage() {
  const t = useTranslations('super-admin.companies');
  const { data: companies, isLoading, isError, error } = useGetAllCompaniesQuery();
  const [createCompany] = useCreateCompanyMutation();
  const [updateCompany] = useUpdateCompanyMutation();
  const { toast, dismiss } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<ICompany | null>(null);

  const handleOpenModal = (company: ICompany | null = null) => {
    setSelectedCompany(company);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedCompany(null);
    setIsModalOpen(false);
  };
  
  const handleSubmit = async (data: CompanyFormData) => {
    const toastId = toast(selectedCompany ? t('toast.updating') : t('toast.creating'), {
      duration: Infinity,
    });

    try {
      if (selectedCompany) {
        await updateCompany({ id: (selectedCompany._id as string).toString(), data }).unwrap();
        toast(t('toast.updateSuccess'));
      } else {
        await createCompany(data).unwrap();
        toast(t('toast.createSuccess'));
      }
    } catch (err) {
      toast(selectedCompany ? t('toast.updateError') : t('toast.createError'));
      // Re-throw to prevent modal from closing on error
      throw err;
    } finally {
      dismiss(toastId);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>{t('errorTitle')}</AlertTitle>
        <AlertDescription>
          {t('errorMessage')}
          {/* @ts-ignore */}
          <p className="text-xs mt-2">{error?.data?.message || error.toString()}</p>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('description')}
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <PlusCircle className="mr-2 h-4 w-4" />
          {t('addButton')}
        </Button>
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('table.name')}</TableHead>
              <TableHead>{t('table.email')}</TableHead>
              <TableHead>{t('table.plan')}</TableHead>
              <TableHead>{t('table.status')}</TableHead>
              <TableHead className="text-right">{t('table.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies && companies.length > 0 ? (
              companies.map((company) => (
                <TableRow key={company._id?.toString()}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell>{company.email}</TableCell>
                  <TableCell>
                    <Badge variant={getSubscriptionPlanVariant(company.subscriptionPlan)}>
                      {company.subscriptionPlan}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.isActive ? 'default' : 'destructive'}>
                      {company.isActive ? t('status.active') : t('status.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(company)}>
                      {t('editButton')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  {t('noResults')}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {isModalOpen && (
        <CompanyFormModal
          key={selectedCompany?._id?.toString() || 'new-company'}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
          company={selectedCompany}
          t={(key) => t(`modal.${key}`)}
        />
      )}
    </div>
  );
}
