import { NextRequest, NextResponse } from 'next/server';
import { responseHandler } from '@/utils/response-handler';
import { userService } from '@/services/db/user.service';
import { updateUserSchema } from '@/lib/validation-schemas';
import { getTranslations } from 'next-intl/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  try {
    const body = await req.json();
    await updateUserSchema.validate(body);

    const updatedUser = await userService.updateUser(params.id, body);

    if (!updatedUser) {
      return responseHandler.error({ message: t('error.notFound', { entity: t('entity.user') }) }, { status: 404 });
    }

    return responseHandler.success(
      { user: updatedUser },
      t('success.updated', { entity: t('entity.user') })
    );
  } catch (error) {
    return responseHandler.error(error);
  }
}
