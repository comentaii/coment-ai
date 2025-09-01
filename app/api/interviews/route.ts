import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { createInterviewSchema } from '@/lib/validation-schemas';
import { interviewService } from '@/services/db';
import { USER_ROLES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';

export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });

    // Yetki kontrolü: Sadece HR Manager ve Super Admin yeni mülakat oluşturabilir
    if (!token || ![USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(token.role as string)) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    await createInterviewSchema.validate(body);
    
    const { candidateId, interviewerId, challengeId, companyId, scheduledAt } = body;

    const newInterview = await interviewService.create({
        candidate: candidateId,
        interviewer: interviewerId,
        challenge: challengeId,
        company: companyId,
        scheduledAt,
    });

    return responseHandler.success(
      { interview: newInterview },
      t('success.created', { entity: t('entity.interview') })
    );
  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
