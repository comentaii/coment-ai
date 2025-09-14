import { NextRequest } from 'next/server';
import { responseHandler } from '@/utils/response-handler';
import { companySchema } from '@/lib/validation-schemas';
import { companyService } from '@/services/db/company.service';
import { getTranslations } from 'next-intl/server';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const t = await getTranslations('api');
  try {
    const body = await req.json();
    await companySchema.validate(body);

    const updatedCompany = await companyService.update(params.id, body);

    if (!updatedCompany) {
      return responseHandler.error({ message: t('error.notFound', { entity: t('entity.company') }) }, { status: 404 });
    }

    return responseHandler.success(
      { company: updatedCompany },
      t('success.updated', { entity: t('entity.company') })
    );
  } catch (error) {
    return responseHandler.error(error);
  }
}
