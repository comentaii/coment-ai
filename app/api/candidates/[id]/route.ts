import { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { candidateProfileService } from '@/services/db/candidate-profile.service';
import { UserService } from '@/services/db/user.service';
import { connectToDatabase } from '@/lib/db';
import { responseHandler } from '@/utils/response-handler';
import mongoose from 'mongoose';

const userService = new UserService();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    const userRoles = (token?.roles as string[]) || [];

    if (!token || !token.companyId || !['hr_manager', 'super_admin'].some(role => userRoles.includes(role))) {
      return responseHandler.error('Unauthorized', 401);
    }

    const id = params.id;
    
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return responseHandler.error('Invalid profile ID.', 400);
    }

    await connectToDatabase();

    // Find the profile to get the associated userId
    const profile = await candidateProfileService.findById(id);
    if (!profile) {
      return responseHandler.error('Candidate profile not found.', 404);
    }
    
    // Security check: ensure the profile belongs to the user's company
    if (profile.companyId.toString() !== token.companyId) {
      return responseHandler.error('Forbidden', 403);
    }

    // Delete the profile and the associated user
    await candidateProfileService.delete(id);
    if (profile.userId) {
      await userService.delete(profile.userId.toString());
    }

    return responseHandler.success(
      { message: 'Candidate deleted successfully.' },
      'Candidate deleted successfully'
    );
  } catch (error) {
    console.error('Error deleting candidate:', error);
    return responseHandler.error('An internal server error occurred.');
  }
}
