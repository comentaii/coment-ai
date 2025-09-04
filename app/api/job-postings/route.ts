import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { ResponseHandler } from '@/utils/response-handler';
import { createJobPostingSchema } from '@/lib/validation-schemas';
import jobPostingService from '@/services/db/job-posting.service';
import { IJobPosting } from '@/schemas/job-posting.model';
import { getTranslations } from 'next-intl/server';
import { UserService } from '@/services/db/user.service';

// GET all job postings
export async function GET(req: NextRequest) {
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });

    if (!token || !token.roles) {
      return ResponseHandler.unauthorized(t('error.unauthorized'));
    }
    
    // An HR manager can only see their own company's postings
    if (token.roles.includes('hr_manager') && token.companyId) {
      const jobPostings = await jobPostingService.findAll({ company: token.companyId });
      return ResponseHandler.success({ jobPostings });
    }

    // A super admin can see all postings
    if (token.roles.includes('super_admin')) {
      const jobPostings = await jobPostingService.findAll();
      return ResponseHandler.success({ jobPostings });
    }
    
    // Other roles are forbidden
    return ResponseHandler.forbidden(t('error.forbidden'));
    
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : t('error.generic');
    return ResponseHandler.error(errorMessage);
  }
}

// POST a new job posting
export async function POST(req: NextRequest) {
  const t = await getTranslations('api.job-postings');
  try {
    const token = await getToken({ req });

    if (!token || !token.roles || (!token.roles.includes('hr_manager') && !token.roles.includes('super_admin'))) {
      return ResponseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    await createJobPostingSchema.validate(body);
    
    const jobPostingData: Partial<IJobPosting> = {
      ...body,
      createdBy: token.sub,
      company: token.companyId,
    };

    const newJobPosting = await jobPostingService.create(jobPostingData);

    return ResponseHandler.success(newJobPosting, t('success.created'), 201);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return ResponseHandler.error(errorMessage);
  }
}
