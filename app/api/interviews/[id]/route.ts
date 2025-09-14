import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { responseHandler } from '@/utils/response-handler';
import { interviewService } from '@/services/db';
import { USER_ROLES } from '@/lib/constants';
import { getTranslations } from 'next-intl/server';
import { IUser } from '@/schemas';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const t = await getTranslations('api');
  try {
    const session = await getToken({ req });
    if (!session) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }
    const interviewData = await interviewService.getInterviewById(params.id);
    return responseHandler.success({ interview: interviewData }, t('success.fetched', { entity: t('entity.interview') }));
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToFetch', { entity: t('entity.interview') })
    );
  }
}
