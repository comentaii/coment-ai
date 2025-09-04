import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import jobPostingService from '@/services/db/job-posting.service';
import { updateJobPostingSchema } from '@/lib/validation-schemas';
import { ROLES, UserRole } from '@/types/rbac';
import { getTranslations } from 'next-intl/server';

const SECRET = process.env.NEXTAUTH_SECRET;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET a single job posting by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) return ResponseHandler.unauthorized();

    const jobPosting = await jobPostingService.findByIdWithPopulatedCreator(id);
    if (!jobPosting) {
      return ResponseHandler.notFound('Job posting not found.');
    }

    // Ensure the user can only access job postings from their own company
    if (token.role !== ROLES.SUPER_ADMIN && jobPosting.company.toString() !== token.companyId) {
        return ResponseHandler.forbidden("You don't have permission to access this resource.");
    }

    return ResponseHandler.success(jobPosting);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}

// UPDATE a job posting by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });
    const jobPosting = await jobPostingService.findById(params.id);

    if (!jobPosting) {
      return ResponseHandler.notFound(t('error.notFound'));
    }

    // Authorization check: User must be a super_admin or the hr_manager of the company that owns the posting
    const isOwner = token?.roles?.includes('hr_manager') && String(jobPosting.company) === token.companyId;
    const isSuperAdmin = token?.roles?.includes('super_admin');

    if (!isOwner && !isSuperAdmin) {
      return ResponseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    await updateJobPostingSchema.validate(body);

    const updatedJobPosting = await jobPostingService.update(params.id, body);
    return ResponseHandler.success({ jobPosting: updatedJobPosting }, t('success.updated'));

  } catch (error) {
    return ResponseHandler.error(error as Error, t('error.generic'));
  }
}

// DELETE a job posting by ID
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });
    const jobPosting = await jobPostingService.findById(params.id);

    if (!jobPosting) {
      return ResponseHandler.notFound(t('error.notFound'));
    }

    // Authorization check: User must be a super_admin or the hr_manager of the company that owns the posting
    const isOwner = token?.roles?.includes('hr_manager') && String(jobPosting.company) === token.companyId;
    const isSuperAdmin = token?.roles?.includes('super_admin');

    if (!isOwner && !isSuperAdmin) {
      return ResponseHandler.forbidden(t('error.forbidden'));
    }

    await jobPostingService.delete(params.id);
    return ResponseHandler.success(null, t('success.deleted'));

  } catch (error) {
    return ResponseHandler.error(error as Error, t('error.generic'));
  }
}
