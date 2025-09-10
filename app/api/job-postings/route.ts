import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { jobPostingService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

// GET all job postings
export async function GET(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    // @ts-ignore
    const companyId = token?.companyId;

    if (!token || !companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const jobPostings = await jobPostingService.findByCompany(companyId);
    return responseHandler.success(jobPostings);
  } catch (error) {
    console.error('Failed to fetch job postings:', error);
    return responseHandler.error(
      t('error.failedToFetch', { entity: t('entity.jobPostings') })
    );
  }
}

// CREATE a new job posting
export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    const companyId = token?.companyId;
    const userId = token?.id;

    if (!token || !companyId || !userId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const body = await req.json();

    const newJobPosting = await jobPostingService.create({
      ...body,
      company: companyId,
      createdBy: userId,
    });

    return responseHandler.success(
      newJobPosting,
      t('success.created', { entity: t('entity.jobPosting') })
    );
  } catch (error) {
    console.error('Failed to create job posting:', error);
    return responseHandler.error(
      t('error.failedToCreate', { entity: t('entity.jobPosting') })
    );
  }
}
