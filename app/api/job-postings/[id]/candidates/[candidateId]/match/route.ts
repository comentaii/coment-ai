import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import { jobMatchingService } from '@/services/jobs/job-matching.service';
import { ROLES, UserRole } from '@/types/rbac';

const SECRET = process.env.NEXTAUTH_SECRET;

// POST - Match a specific candidate to a specific job posting
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string; candidateId: string } }
) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token || !token.sub) {
      return ResponseHandler.unauthorized();
    }

    // Ensure only HR Managers or Super Admins can trigger matching
    if (![ROLES.HR_MANAGER, ROLES.SUPER_ADMIN].includes(token.role as UserRole)) {
      return ResponseHandler.forbidden();
    }

    const jobPostingId = params.id;
    const candidateId = params.candidateId;
    const companyId = token.companyId as string;

    if (!companyId) {
      return ResponseHandler.error('Company ID not found in token');
    }

    // Match the specific candidate to the job posting
    const jobApplication = await jobMatchingService.matchCandidateToJob(
      candidateId,
      jobPostingId,
      companyId
    );

    return ResponseHandler.success(
      { jobApplication },
      'Candidate successfully matched to job posting.',
      201
    );

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}
