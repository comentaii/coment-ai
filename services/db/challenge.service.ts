import { BaseService } from './base.service';
import { Challenge, IChallenge } from '@/schemas';

export class ChallengeService extends BaseService<IChallenge> {
  constructor() {
    super(Challenge);
  }

  // Şirkete özel challenge'ları getiren bir metot ekleyebiliriz
  async findByCompany(companyId: string): Promise<IChallenge[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId }).exec();
    });
  }
}

export const challengeService = new ChallengeService();
