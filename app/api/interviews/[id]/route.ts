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
    const token = await getToken({ req });
    if (!token) {
      return responseHandler.unauthorized(t('error.unauthorized'));
    }

    const interviewId = params.id;
    const interview = await interviewService.getInterviewDetails(interviewId);

    if (!interview) {
      return responseHandler.notFound(t('error.notFound', { entity: t('entity.interview') }));
    }

    // Yetki Kontrolü
    const userId = token.sub; // Oturum açan kullanıcının ID'si
    const userRole = token.role as string;
    const userCompanyId = (token.company as { _id: string })?._id;

    const isCandidate = interview.candidate._id.toString() === userId;
    const isInterviewer = interview.interviewer._id.toString() === userId;
    const isCompanyAdmin = userRole === USER_ROLES.HR_MANAGER && userCompanyId === interview.company._id.toString();
    const isSuperAdmin = userRole === USER_ROLES.SUPER_ADMIN;

    if (!isCandidate && !isInterviewer && !isCompanyAdmin && !isSuperAdmin) {
      return responseHandler.forbidden(t('error.forbidden'));
    }
    
    // Adaya mülakatçının bilgilerini, mülakatçıya adayın bilgilerini gönder
    const interviewData = {
      ...interview.toObject(),
      userRole: isCandidate ? 'candidate' : 'interviewer'
    };


    return responseHandler.success({ interview: interviewData });
  } catch (error) {
    return responseHandler.error(error as Error);
  }
}
