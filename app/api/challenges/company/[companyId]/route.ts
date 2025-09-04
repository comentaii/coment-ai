import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { challengeService } from '@/services/db';
import { getTranslations } from 'next-intl/server';
import { USER_ROLES } from '@/lib/constants';

export async function GET(req: NextRequest, { params }: { params: { companyId: string } }) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });
    if (!token) {
      return responseHandler.unauthorized(t('error.unauthorized'));
    }

    const companyId = params.companyId;
    
    // Yetki kontrolü: Kullanıcı sadece kendi şirketinin sorularını görebilir (veya super_admin ise)
    if (token.role !== USER_ROLES.SUPER_ADMIN && (token.company as { _id: string })?._id !== companyId) {
        return responseHandler.forbidden(t('error.forbidden'));
    }

    const challenges = await challengeService.findByCompany(companyId);
    return responseHandler.success(challenges);
    
  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
