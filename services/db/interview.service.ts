import { Interview, IInterview } from '@/schemas';
import { BaseService } from './base.service';
import mongoose from 'mongoose';

export class InterviewService extends BaseService<IInterview> {
  constructor() {
    super(Interview);
  }

  /**
   * Bir mülakatı, ilişkili olduğu diğer verilerle (populate) birlikte getirir.
   * Yetki kontrolü için bu metot kullanılacak.
   * @param id Mülakat ID'si
   */
  async getInterviewDetails(id: string): Promise<IInterview | null> {
    return this.executeWithErrorHandling(async () => {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      return this.model
        .findById(id)
        .populate('candidate', 'name email') // Adayın sadece adını ve emailini al
        .populate('interviewer', 'name email') // Mülakatçının sadece adını ve emailini al
        .populate('challenge') // Sorunun tüm detaylarını al
        .populate('company', 'name') // Şirketin sadece adını al
        .exec();
    });
  }

  async getInterviewsByCompany(companyId: string): Promise<IInterview[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model
        .find({ companyId: new mongoose.Types.ObjectId(companyId) })
        .populate('jobPostingId', 'title')
        .populate('interviewerId', 'name email')
        .sort({ scheduledDate: -1 })
        .exec();
    });
  }

  async getAllInterviews(): Promise<IInterview[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model
        .find({})
        .populate('jobPostingId', 'title')
        .populate('interviewerId', 'name email')
        .sort({ scheduledDate: -1 })
        .exec();
    });
  }
}

export const interviewService = new InterviewService();
