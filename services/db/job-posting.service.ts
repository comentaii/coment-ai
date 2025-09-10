import { BaseService } from './base.service';
import JobPosting, { IJobPosting } from '@/schemas/job-posting.model';
import mongoose from 'mongoose';
import { jobMatchingService } from '@/services/jobs/job-matching.service';

class JobPostingService extends BaseService<IJobPosting> {
  constructor() {
    super(JobPosting);
  }

  async findByCompany(companyId: string | mongoose.Types.ObjectId): Promise<IJobPosting[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId }).populate('createdBy', 'name email').exec();
    });
  }
  
  async findByIdWithPopulatedCreator(id: string): Promise<IJobPosting | null> {
    this.validateId(id);
    return this.executeWithErrorHandling(async () => {
      return this.model.findById(id).populate('createdBy', 'name email').exec();
    });
  }

  async create(data: Partial<IJobPosting>): Promise<IJobPosting> {
    return this.executeWithErrorHandling(async () => {
      const entity = new this.model(data);
      const savedJobPosting = await entity.save();
      
      // İş ilanı oluşturulduktan sonra otomatik eşleştirme işlemini başlat
      // Bu işlem arka planda çalışacak, kullanıcı beklemeyecek
      if (savedJobPosting.company) {
        // Socket.io instance'ı olmadığı için null olarak geçiyoruz
        // Gerçek uygulamada bu işlem bir queue sistemi ile yapılabilir
        jobMatchingService.startMatchingForJob(
          savedJobPosting._id.toString(), 
          savedJobPosting.company.toString(), 
          null as any
        ).catch(error => {
          console.error('Auto-matching failed for job posting:', savedJobPosting._id, error);
        });
      }
      
      return savedJobPosting;
    });
  }
}

export const jobPostingService = new JobPostingService();
