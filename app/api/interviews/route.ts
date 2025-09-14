import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { createInterviewSchema } from '@/lib/validation-schemas';
import { interviewService } from '@/services/db';
import { USER_ROLES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return responseHandler.unauthorized(t('error.unauthorized'));
    }

    const userRoles = session.user.roles || [];
    const isSuperAdmin = userRoles.includes(USER_ROLES.SUPER_ADMIN);
    const companyId = session.user.companyId;
    
    let interviews;
    if (isSuperAdmin) {
      interviews = await interviewService.getAllInterviews();
    } else if (companyId) {
      interviews = await interviewService.getInterviewsByCompany(companyId);
    } else {
      return responseHandler.unauthorized(t('error.unauthorized'));
    }

    return responseHandler.success({ interviews });
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToFetch', { entity: t('entityPlural.interviews') })
    );
  }
}

export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const token = await getToken({ req });

    // Yetki kontrolü: Sadece HR Manager ve Super Admin yeni mülakat oluşturabilir
    if (!token || !(token.roles as string[])?.some(role => [USER_ROLES.HR_MANAGER, USER_ROLES.SUPER_ADMIN].includes(role))) {
      return responseHandler.forbidden(t('error.forbidden'));
    }

    const body = await req.json();
    await createInterviewSchema.validate(body);
    
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const result = await interviewService.createInterviewForCandidates(body);

    return responseHandler.success(result, t('success.created', { entity: t('entity.interview') }));
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToCreate', { entity: t('entity.interview') })
    );
  }
}
