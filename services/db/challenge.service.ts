import { Challenge, IChallenge } from '@/schemas';
import { BaseService } from './base.service';

class ChallengeService extends BaseService<IChallenge> {
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

const challengeService = new ChallengeService();
export default challengeService;
