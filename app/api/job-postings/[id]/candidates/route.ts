import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import { jobMatchingService } from '@/services/jobs/job-matching.service';
import { ROLES, UserRole } from '@/types/rbac';

const SECRET = process.env.NEXTAUTH_SECRET;

// GET - Get all candidates (matched and unmatched) for a job posting
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req });

    if (!token || !token.roles || !token.roles.includes('hr_manager')) {
      return ResponseHandler.forbidden();
    }

    const jobPostingId = params.id;
    const companyId = token.companyId as string;

    if (!companyId) {
      return ResponseHandler.error('Company ID not found in token');
    }

    // Get all candidates for the job posting
    const candidates = await jobMatchingService.getCandidatesForJob(jobPostingId, companyId);

    return ResponseHandler.success(candidates);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}
