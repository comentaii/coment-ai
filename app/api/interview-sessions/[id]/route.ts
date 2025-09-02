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
      return responseHandler.error('Unauthorized', 401);
    }

    const result = await interviewSessionService.getSessionWithSlots(params.id);
    
    if (!result) {
      return responseHandler.error('Interview session not found', 404);
    }

    return responseHandler.success(
      result,
      t('success.fetched', { entity: 'Interview Session' })
    );
  } catch (error) {
    console.error('Error fetching interview session:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : 'Failed to fetch interview session'
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
      return responseHandler.error('Unauthorized', 401);
    }

    const body = await request.json();
    await updateInterviewSessionSchema.validate(body);

    const updatedSession = await interviewSessionService.updateInterviewSession(
      params.id,
      body
    );

    if (!updatedSession) {
      return responseHandler.error('Interview session not found', 404);
    }

    return responseHandler.success(
      { session: updatedSession },
      t('success.updated', { entity: 'Interview Session' })
    );
  } catch (error) {
    console.error('Error updating interview session:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : 'Failed to update interview session'
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.companyId) {
      return responseHandler.error('Unauthorized', 401);
    }

    // Soft delete by updating status to cancelled
    const updatedSession = await interviewSessionService.updateInterviewSession(
      params.id,
      { status: 'cancelled' }
    );

    if (!updatedSession) {
      return responseHandler.error('Interview session not found', 404);
    }

    return responseHandler.success(
      { session: updatedSession },
      t('success.cancelled', { entity: 'Interview Session' })
    );
  } catch (error) {
    console.error('Error cancelling interview session:', error);
    return responseHandler.error(
      error instanceof Error ? error.message : 'Failed to cancel interview session'
    );
  }
}
