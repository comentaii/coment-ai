import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { getTranslations } from 'next-intl/server';
import { candidateProfileService } from '@/services/db';

export async function GET(
  req: NextRequest,
  context: { params: { companyId: string } }
) {
  const { params } = context;
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    if (!token) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    if (!(token.roles as string[])?.includes('super_admin') && token.companyId !== params.companyId) {
        return responseHandler.forbidden(t('error.forbidden'));
    }

    const candidates = await candidateProfileService.findAll({
      companyId: params.companyId,
    });
    return responseHandler.success(
      { candidates },
      t('success.fetched', { entity: t('entity.candidates') })
    );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error
        ? error.message
        : t('error.failedToFetch', { entity: t('entity.candidates') })
    );
  }
}
