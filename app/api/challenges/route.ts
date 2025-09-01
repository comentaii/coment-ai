import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { challengeService } from '@/services/db';
import { USER_ROLES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';

export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });

    if (!token || ![USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(token.role as string)) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    
    // Gelen body'e kullanıcının şirket bilgisini ekle
    const challengeData = { ...body, company: (token.company as { _id: string })._id };

    const newChallenge = await challengeService.create(challengeData);

    return responseHandler.success(
      { challenge: newChallenge },
      t('success.created', { entity: t('entity.challenge') })
    );
  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
