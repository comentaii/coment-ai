import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { ResponseHandler } from '@/utils/response-handler';
import { UserService } from '@/services/db/user.service';
import { connectToDatabase } from '@/lib/db';

const userService = new UserService();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return ResponseHandler.error('Yetkisiz erişim', 401);
    }

    // Get current user to check company
    const currentUser = await userService.findById(session.user.id);
    if (!currentUser || !currentUser.companyId) {
      return ResponseHandler.error('Şirket bilgisi bulunamadı', 400);
    }

    await connectToDatabase();

    // Get all interviewers in the company
    const interviewers = await userService.findInterviewersByCompany(currentUser.companyId);

    return ResponseHandler.success({ interviewers });
  } catch (error) {
    console.error('Error fetching interviewers:', error);
    return ResponseHandler.error('Mülakatçı listesi alınamadı');
  }
}
