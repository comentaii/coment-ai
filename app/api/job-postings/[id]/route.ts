import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import jobPostingService from '@/services/db/job-posting.service';
import { updateJobPostingSchema } from '@/lib/validation-schemas';
import { ROLES, UserRole } from '@/types/rbac';

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
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
    try {
        const token = await getToken({ req, secret: SECRET });
        if (!token) return ResponseHandler.unauthorized();

        if (!['hr_manager', 'super_admin'].includes(token.role as UserRole)) {
            return ResponseHandler.forbidden();
        }

        const jobPosting = await jobPostingService.findById(id);
        if (!jobPosting) {
            return ResponseHandler.notFound('Job posting not found.');
        }

        if (token.role !== ROLES.SUPER_ADMIN && jobPosting.company.toString() !== token.companyId) {
            return ResponseHandler.forbidden();
        }

        const body = await req.json();
        await updateJobPostingSchema.validate(body);

        const updatedJobPosting = await jobPostingService.update(id, body);

        return ResponseHandler.success(updatedJobPosting);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return ResponseHandler.error(errorMessage);
    }
}

// DELETE a job posting by ID
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const { id } = await params;
    try {
        const token = await getToken({ req, secret: SECRET });
        if (!token) return ResponseHandler.unauthorized();

        if (!['hr_manager', 'super_admin'].includes(token.role as UserRole)) {
            return ResponseHandler.forbidden();
        }
        
        const jobPosting = await jobPostingService.findById(id);
        if (!jobPosting) {
            return ResponseHandler.notFound('Job posting not found.');
        }

        if (token.role !== ROLES.SUPER_ADMIN && jobPosting.company.toString() !== token.companyId) {
            return ResponseHandler.forbidden();
        }

        await jobPostingService.delete(id);

        return ResponseHandler.success({ message: 'Job posting deleted successfully' });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return ResponseHandler.error(errorMessage);
    }
}
