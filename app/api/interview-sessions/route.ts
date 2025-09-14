import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { responseHandler } from '@/utils/response-handler';
import { createInterviewSessionSchema } from '@/lib/validation-schemas';
import { interviewSessionService } from '@/services/db';
import { getTranslations } from 'next-intl/server';
import { USER_ROLES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error('Unauthorized access. Please login.', 401);
    }
    
    // Safely get translations with fallback
    let t: any;
    try {
      t = await getTranslations('api');
    } catch (translationError) {
      console.warn('Translation loading failed, using fallbacks:', translationError);
      t = (key: string, params?: any) => {
        // Fallback translations
        if (key === 'success.created') return `${params?.entity || 'Item'} created successfully.`;
        if (key === 'error.failedToCreate') return `Failed to create ${params?.entity || 'item'}.`;
        if (key === 'entity.interviewSession') return 'Interview Session';
        return key; // Return key if no translation found
      };
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
      error instanceof Error ? error.message : 'Failed to create interview session. Please try again.'
    );
  }
}

export async function GET(request: NextRequest) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const { searchParams } = new URL(request.url);
    const options = {
      status: searchParams.get('status') || undefined,
      interviewerId: searchParams.get('interviewerId') || undefined,
      jobPostingId: searchParams.get('jobPostingId') || undefined,
      limit: parseInt(searchParams.get('limit') || '50'),
      skip: parseInt(searchParams.get('skip') || '0'),
    };

    const userRoles = session.user.roles || [];
    const isSuperAdmin = userRoles.includes(USER_ROLES.SUPER_ADMIN);
    const companyId = session.user.companyId;

    let sessions;
    if (isSuperAdmin) {
      sessions = await interviewSessionService.getAllSessions(options);
    } else if (companyId) {
      sessions = await interviewSessionService.getSessionsByCompany(
        companyId,
        options
      );
    } else {
      // Not a super admin and no companyId, unauthorized
      return responseHandler.error(t('error.unauthorized'), 401);
    }

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
