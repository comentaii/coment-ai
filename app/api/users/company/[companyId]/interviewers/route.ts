import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { userService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

export async function GET(
  req: NextRequest,
  context: { params: { companyId: string } }
) {
  const { params } = context;
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    if (!token || !token.roles) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    // Authorization check: User must be a super_admin or belong to the requested company
    if (!token.roles.includes('super_admin') && token.companyId !== params.companyId) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const interviewers = await userService.findInterviewersByCompany(
      params.companyId
    );
    return responseHandler.success(
      { interviewers },
      t('success.fetched', { entity: t('entity.interviewers') })
    );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error
        ? error.message
        : t('error.failedToFetch', { entity: t('entity.interviewers') })
    );
  }
}
