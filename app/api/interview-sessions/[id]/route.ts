import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { responseHandler } from '@/utils/response-handler';
import { updateInterviewSessionSchema } from '@/lib/validation-schemas';
import { interviewSessionService } from '@/services/db';
import { getTranslations } from 'next-intl/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const interviewSession = await interviewSessionService.findById(params.id);
    if (!interviewSession) {
      return responseHandler.error(t('error.notFound', { entity: t('entity.interviewSession') }), 404);
    }

    return responseHandler.success(
      { session: interviewSession },
      t('success.fetched', { entity: t('entity.interviewSession') })
    );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToFetch', { entity: t('entity.interviewSession') })
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const body = await request.json();
    await updateInterviewSessionSchema.validate(body);

    const updatedSession = await interviewSessionService.updateInterviewSession(
      params.id,
      body
    );

    if (!updatedSession) {
      return responseHandler.error(t('error.notFound', { entity: t('entity.interviewSession') }), 404);
    }

    return responseHandler.success(
      { session: updatedSession },
      t('success.updated', { entity: t('entity.interviewSession') })
    );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToUpdate', { entity: t('entity.interviewSession') })
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error(t('error.unauthorized'), 401);
    }

    const deleted = await interviewSessionService.delete(params.id);
    if (!deleted) {
      return responseHandler.error(t('error.notFound', { entity: t('entity.interviewSession') }), 404);
    }

    return responseHandler.success(
      { success: true },
      t('success.deleted', { entity: t('entity.interviewSession') })
    );
  } catch (error) {
    return responseHandler.error(
      error instanceof Error ? error.message : t('error.failedToDelete', { entity: t('entity.interviewSession') })
    );
  }
}
