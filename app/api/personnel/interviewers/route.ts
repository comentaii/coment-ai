import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { responseHandler } from '@/utils/response-handler';
import { userService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

export async function GET(request: NextRequest) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    console.log('Session user:', session.user);
    console.log('Company ID:', session.user.companyId);

    // Get users with interviewer roles from the same company
    const interviewers = await userService.findInterviewersByCompany(session.user.companyId);
    
    console.log('Found interviewers:', interviewers.length);
    console.log('Interviewers data:', interviewers.map(u => ({ id: u._id, name: u.name, roles: u.roles, isActive: u.isActive })));

    return responseHandler.success(
      { interviewers },
      t('success.fetched', { entity: t('entity.interviewers') })
    );
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToFetch', { entity: t('entity.interviewers') })
    );
  }
}