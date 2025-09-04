import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { challengeService } from '@/services/db';
import { getTranslations } from 'next-intl/server';
import { USER_ROLES } from '@/lib/constants';

export async function GET(req: NextRequest, { params }: { params: Promise<{ companyId: string }> }) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    if (!token || !token.roles) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const { companyId } = await params;

    // Authorization check: User must be a super_admin or belong to the requested company
    if (!token.roles.includes('super_admin') && token.companyId !== companyId) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const challenges = await challengeService.findAll({ company: companyId });
    return responseHandler.success({ challenges });

  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
