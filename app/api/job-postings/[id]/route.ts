import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { jobPostingService } from '@/services/db';
import { updateJobPostingSchema } from '@/lib/validation-schemas';
import { ROLES } from '@/types/rbac';
import { getTranslations } from 'next-intl/server';

const SECRET = process.env['NEXTAUTH_SECRET'];

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET a single job posting by ID
export async function GET(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token) return responseHandler.unauthorized();

    const jobPosting = await jobPostingService.findByIdWithPopulatedCreator(id);
    if (!jobPosting) {
      return responseHandler.notFound('Job posting not found.');
    }

    // Ensure the user can only access job postings from their own company
    if (token.role !== ROLES.SUPER_ADMIN && jobPosting.company.toString() !== token.companyId) {
        return responseHandler.forbidden("You don't have permission to access this resource.");
    }

    return responseHandler.success(jobPosting);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return responseHandler.error(errorMessage);
  }
}

// UPDATE a job posting by ID
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });
    const jobPosting = await jobPostingService.findById(id);

    if (!jobPosting) {
      return responseHandler.notFound(t('error.notFound'));
    }

    // Authorization check: User must be a super_admin or the hr_manager of the company that owns the posting
    const isOwner = token?.roles?.includes('hr_manager') && String(jobPosting.company) === token.companyId;
    const isSuperAdmin = token?.roles?.includes('super_admin');

    if (!isOwner && !isSuperAdmin) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    await updateJobPostingSchema.validate(body);

    const updatedJobPosting = await jobPostingService.update(id, body);
    return responseHandler.success({ jobPosting: updatedJobPosting }, t('success.updated'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : t('error.generic');
    return responseHandler.error(errorMessage);
  }
}

// DELETE a job posting by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });
    const jobPosting = await jobPostingService.findById(id);

    if (!jobPosting) {
      return responseHandler.notFound(t('error.notFound'));
    }

    // Authorization check: User must be a super_admin or the hr_manager of the company that owns the posting
    const isOwner = token?.roles?.includes('hr_manager') && String(jobPosting.company) === token.companyId;
    const isSuperAdmin = token?.roles?.includes('super_admin');

    if (!isOwner && !isSuperAdmin) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    await jobPostingService.delete(id);
    return responseHandler.success(null, t('success.deleted'));

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : t('error.generic');
    return responseHandler.error(errorMessage);
  }
}
