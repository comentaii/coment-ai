import { NextRequest } from 'next/server';
import { responseHandler } from '@/utils/response-handler';
import { userService } from '@/services/db/user.service';
import { inviteUserSchema } from '@/lib/validation-schemas';
import { getTranslations } from 'next-intl/server';

export async function GET(req: NextRequest) {
  try {
    // RBAC is handled in middleware
    const users = await userService.findAllWithCompany();
    return responseHandler.success(users);
  } catch (error) {
    return responseHandler.error(error);
  }
}

export async function POST(req: NextRequest) {
  const t = await getTranslations('api');
  try {
    const body = await req.json();
    await inviteUserSchema.validate(body);
    
    // Generate a random password
    const temporaryPassword = Math.random().toString(36).slice(-8);

    const newUser = await userService.createUser({
      ...body,
      password: temporaryPassword,
      isActive: true, // Or based on your logic, maybe requires email verification
    });

    // TODO: Send an email to the user with their login credentials
    // await emailService.sendWelcomeEmail(newUser.email, temporaryPassword);

    return responseHandler.success(
      { user: newUser },
      t('success.created', { entity: t('entity.user') }),
      201
    );
  } catch (error) {
    return responseHandler.error(error);
  }
}
