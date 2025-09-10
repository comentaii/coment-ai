import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { challengeService } from '@/services/db';
import { USER_ROLES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';
import { createChallengeSchema } from '@/lib/validation/challenge';

export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });

    if (!token || !(token.roles as string[])?.some(role => [USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(role))) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    
    await createChallengeSchema.validate(body);

    const challenge = await challengeService.create(body);
    return responseHandler.success(
      { challenge },
      t('success.created', { entity: t('entity.challenge') })
      );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToCreate', { entity: t('entity.challenge') })
      );
  }
}
