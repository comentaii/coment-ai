import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { connectToDatabase } from '@/lib/db';
import { responseHandler } from '@/utils/response-handler';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.companyId) {
      return responseHandler.error('Unauthorized', 401);
    }

    await connectToDatabase();
    const companyId = session.user.companyId;
    const candidates = await candidateProfileService.findByCompany(companyId);
    
    console.log('API candidates response:', {
      companyId,
      candidatesCount: candidates?.length,
      candidatesType: typeof candidates,
      isArray: Array.isArray(candidates),
      firstCandidate: candidates?.[0]
    });
    
    return responseHandler.success(candidates, 'Candidates fetched successfully');
  } catch (error) {
    console.error('Error fetching candidates:', error);
    return responseHandler.error('An internal server error occurred.');
  }
}