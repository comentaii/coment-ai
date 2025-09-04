import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { ResponseHandler } from '@/utils/response-handler';
import { UserService } from '@/services/db/user.service';
import { connectToDatabase } from '@/lib/db';
import { updateUserRolesSchema } from '@/lib/validation-schemas';
import { USER_ROLES } from '@/lib/constants/roles';

const userService = new UserService();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    await updateUserRolesSchema.validate(body);

    await connectToDatabase();

    // Get target user
    const targetUser = await userService.findById(params.id);
    if (!targetUser) {
      return ResponseHandler.error('Kullanıcı bulunamadı', 404);
    }

    // Check if target user is in the same company
    if (targetUser.companyId?.toString() !== currentUser.companyId.toString()) {
      return ResponseHandler.error('Bu kullanıcıyı düzenleme yetkiniz yok', 403);
    }

    // Update user roles
    const updatedUser = await userService.updateUserRoles(params.id, body.roles);

    return ResponseHandler.success(
      { user: updatedUser },
      'Kullanıcı rolleri başarıyla güncellendi'
    );
  } catch (error) {
    console.error('Error updating user roles:', error);
    return ResponseHandler.error('Kullanıcı rolleri güncellenemedi');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Prevent self-deletion
    if (params.id === session.user.id) {
      return ResponseHandler.error('Kendi hesabınızı silemezsiniz', 400);
    }

    await connectToDatabase();

    // Get target user
    const targetUser = await userService.findById(params.id);
    if (!targetUser) {
      return ResponseHandler.error('Kullanıcı bulunamadı', 404);
    }

    // Check if target user is in the same company
    if (targetUser.companyId?.toString() !== currentUser.companyId.toString()) {
      return ResponseHandler.error('Bu kullanıcıyı silme yetkiniz yok', 403);
    }

    // Deactivate user instead of deleting
    const deactivatedUser = await userService.deactivateUser(params.id);

    return ResponseHandler.success(
      { user: deactivatedUser },
      'Kullanıcı başarıyla deaktive edildi'
    );
  } catch (error) {
    console.error('Error deactivating user:', error);
    return ResponseHandler.error('Kullanıcı deaktive edilemedi');
  }
}

