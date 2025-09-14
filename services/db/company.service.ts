import { BaseService } from './base.service';
import { Company, ICompany } from '@/schemas/company.model';

export class CompanyService extends BaseService<ICompany> {
  constructor() {
    super(Company);
  }

  async createCompany(companyData: Partial<ICompany>): Promise<ICompany> {
    return this.executeWithErrorHandling(async () => {
      const company = new this.model(companyData);
      return company.save();
    });
  }

  async findByEmail(email: string): Promise<ICompany | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findOne({ email: email.toLowerCase() }).exec();
    });
  }

  async findByDomain(domain: string): Promise<ICompany | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findOne({ domain: domain.toLowerCase() }).exec();
    });
  }

  async updateCompanyQuotas(id: string, quotas: Partial<ICompany['quotas']>): Promise<ICompany | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(
        id, 
        { $set: { quotas } }, 
        { new: true }
      ).exec();
    });
  }

  async getActiveCompanies(): Promise<ICompany[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ isActive: true }).exec();
    });
  }

  // findAll method is inherited from BaseService, so we don't need to re-declare it
  // unless we want to add specific logic.
  // For super-admin, we want all companies, so the default `findAll` is perfect.
}

export const companyService = new CompanyService(); 