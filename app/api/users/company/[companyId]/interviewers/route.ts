import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { userService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    if (!token || !token.roles) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const companyId = params.companyId;

    // Authorization check: User must be a super_admin or belong to the requested company
    if (!token.roles.includes('super_admin') && token.companyId !== companyId) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const interviewers = await userService.findInterviewersByCompany(companyId);
    return responseHandler.success({ interviewers });

  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
