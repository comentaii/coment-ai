import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth.config';
import { ResponseHandler } from '@/utils/response-handler';
import { UserService } from '@/services/db/user.service';
import { connectToDatabase } from '@/lib/db';
import { inviteUserSchema } from '@/lib/validation-schemas';
import { USER_ROLES } from '@/lib/constants/roles';
import { emailService } from '@/services/email/email.service';

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

    // Check if user has HR Manager role
    if (!currentUser.roles.includes(USER_ROLES.HR_MANAGER)) {
      return ResponseHandler.error('Bu işlem için yetkiniz yok', 403);
    }

    await connectToDatabase();

    // Get all active users in the company
    const users = await userService.findActiveUsersByCompany(currentUser.companyId);

    return ResponseHandler.success({ users });
  } catch (error) {
    console.error('Error fetching personnel:', error);
    return ResponseHandler.error('Personel listesi alınamadı');
  }
}

export async function POST(request: NextRequest) {
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

    // Check if user has HR Manager role
    if (!currentUser.roles.includes(USER_ROLES.HR_MANAGER)) {
      return ResponseHandler.error('Bu işlem için yetkiniz yok', 403);
    }

    const body = await request.json();
    await inviteUserSchema.validate(body);

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await userService.findByEmail(body.email);
    if (existingUser) {
      return ResponseHandler.error('Bu email adresi zaten kullanımda', 400);
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Create user
    const userData = {
      name: body.name,
      email: body.email,
      password: tempPassword,
      roles: body.roles,
      companyId: currentUser.companyId,
      invitedBy: currentUser._id,
      isActive: true,
    };

    const newUser = await userService.createUser(userData);

    // Send invitation email
    try {
      await emailService.sendUserInvitation({
        to: body.email,
        name: body.name,
        tempPassword,
        roles: body.roles,
      });
    } catch (emailError) {
      console.error('Error sending invitation email:', emailError);
      // Don't fail the request if email fails
    }

    return ResponseHandler.success(
      { user: newUser },
      'Kullanıcı başarıyla davet edildi'
    );
  } catch (error) {
    console.error('Error inviting user:', error);
    return ResponseHandler.error('Kullanıcı davet edilemedi');
  }
}
