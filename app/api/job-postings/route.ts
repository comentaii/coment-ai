import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import { createJobPostingSchema } from '@/lib/validation-schemas';
import jobPostingService from '@/services/db/job-posting.service';
import { IJobPosting } from '@/schemas/job-posting.model';
import { ROLES, UserRole } from '@/types/rbac';

const SECRET = process.env.NEXTAUTH_SECRET;

// GET all job postings
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token || !token.sub) {
      return ResponseHandler.unauthorized();
    }

    const jobPostings = await jobPostingService.findByCompany(token.companyId as string);

    return ResponseHandler.success(jobPostings);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}

// POST a new job posting
export async function POST(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: SECRET });
    if (!token || !token.sub) {
      return ResponseHandler.unauthorized();
    }

    // Ensure only HR Managers or Super Admins can create job postings
    if (![ROLES.HR_MANAGER, ROLES.SUPER_ADMIN].includes(token.role as UserRole)) {
      return ResponseHandler.forbidden();
    }

    const body = await req.json();
    await createJobPostingSchema.validate(body);
    
    const jobPostingData: Partial<IJobPosting> = {
      ...body,
      createdBy: token.sub,
      company: token.companyId,
    };

    const newJobPosting = await jobPostingService.create(jobPostingData);

    return ResponseHandler.success(newJobPosting, 'Job posting created successfully.', 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}
