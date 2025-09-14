import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { connectToDatabase } from '@/lib/db';
import { responseHandler } from '@/utils/response-handler';
import { USER_ROLES } from '@/lib/constants';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return responseHandler.error('Unauthorized', 401);
    }

    await connectToDatabase();
    
    const userRoles = session.user.roles || [];
    const isSuperAdmin = userRoles.includes(USER_ROLES.SUPER_ADMIN);
    const companyId = session.user.companyId;

    let candidates;
    if (isSuperAdmin) {
      candidates = await candidateProfileService.findAllPopulated();
    } else if (companyId) {
      candidates = await candidateProfileService.findByCompany(companyId);
    } else {
      return responseHandler.error('Unauthorized', 401);
    }
    
    return responseHandler.success(candidates, 'Candidates fetched successfully');
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return responseHandler.error('An internal server error occurred.');
  }
}