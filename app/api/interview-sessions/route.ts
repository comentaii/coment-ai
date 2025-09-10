import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { responseHandler } from '@/utils/response-handler';
import { createInterviewSessionSchema } from '@/lib/validation-schemas';
import { interviewSessionService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

export async function POST(request: NextRequest) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const body = await request.json();
    await createInterviewSessionSchema.validate(body);

    const result = await interviewSessionService.createInterviewSession(
      body,
      session.user.companyId
    );

    return responseHandler.success(
      {
        session: result.session,
        slots: result.slots,
        message: 'Interview session created successfully'
      },
      t('success.created', { entity: t('entity.interviewSession') })
    );
  } catch (error) {
    console.error('Error creating interview session:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToCreate', { entity: t('entity.interviewSession') })
    );
  }
}

export async function GET(request: NextRequest) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const interviewerId = searchParams.get('interviewerId');
    const jobPostingId = searchParams.get('jobPostingId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const skip = parseInt(searchParams.get('skip') || '0');

    const sessions = await interviewSessionService.getSessionsByCompany(
      session.user.companyId,
      {
        status: status || undefined,
        interviewerId: interviewerId || undefined,
        jobPostingId: jobPostingId || undefined,
        limit,
        skip
      }
    );

    return responseHandler.success(
      { sessions },
      t('success.fetched', { entity: t('entity.interviewSessions') })
    );
  } catch (error) {
    console.error('Error fetching interview sessions:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToFetch', { entity: t('entity.interviewSessions') })
    );
  }
}
