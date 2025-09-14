import { NextRequest } from 'next/server';
import { responseHandler } from '@/utils/response-handler';
import { companyService } from '@/services/db/company.service';

export async function GET(req: NextRequest) {
  try {
    // Note: RBAC is handled in middleware for API routes,
    // ensuring only SUPER_ADMIN can access this.
    const companies = await companyService.findAll();
    return responseHandler.success(companies);
  } catch (error) {
    return responseHandler.error(error);
  }
}
