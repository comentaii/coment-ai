import { BaseService } from './base.service';
import { CandidateProfile, ICandidateProfile, ICVAnalysisResult } from '@/schemas/candidate-profile.model';
import mongoose from 'mongoose';

export class CandidateProfileService extends BaseService<ICandidateProfile> {
  constructor() {
    super(CandidateProfile);
  }

  /**
   * Creates a new candidate profile or updates an existing one based on userId.
   * This logic is crucial for handling re-uploads of CVs for the same candidate.
   * @param userId - The ID of the user (candidate).
   * @param companyId - The ID of the company the candidate belongs to.
   * @param cvPath - The path to the newly uploaded CV.
   * @returns The created or updated candidate profile.
   */
  async createOrUpdateProfile(
    userId: string | mongoose.Types.ObjectId, 
    companyId: string | mongoose.Types.ObjectId,
    cvPath: string
  ): Promise<ICandidateProfile> {
    return this.executeWithErrorHandling(async () => {
      const existingProfile = await this.model.findOne({ userId });

      if (existingProfile) {
        // If profile exists, update it
        existingProfile.cvPath = cvPath;
        existingProfile.status = 'pending_analysis';
        existingProfile.analysisResult = undefined; // Clear previous analysis
        return existingProfile.save();
      } else {
        // If not, create a new one
        const newProfile = new this.model({
          userId,
          companyId,
          cvPath,
          status: 'pending_analysis',
        });
        return newProfile.save();
      }
    });
  }

  /**
   * Updates the analysis data for a candidate profile after AI processing.
   * @param userId - The ID of the user (candidate).
   * @param analysisResult - The structured analysis result from Gemini.
   * @returns The updated candidate profile.
   */
  async updateAnalysisResult(
    userId: string | mongoose.Types.ObjectId, 
    analysisResult: ICVAnalysisResult
  ): Promise<ICandidateProfile | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findOneAndUpdate(
        { userId },
        { 
          $set: { 
            analysisResult,
            status: 'analyzed',
          } 
        },
        { new: true }
      ).exec();
    });
  }

  /**
   * Finds all candidate profiles for a given company, and populates the user data.
   * @param companyId - The ID of the company.
   * @returns A list of candidate profiles with their associated user details.
   */
  async findByCompany(companyId: string): Promise<(ICandidateProfile & { userId: { name: string, email: string, image?: string } })[]> {
    return this.executeWithErrorHandling(async () => {
      const profiles = await this.model
        .find({ companyId })
        .populate<{ userId: { name: string, email: string, image?: string } }>('userId', 'name email image') // Populate user fields
        .sort({ createdAt: -1 })
        .exec();
      return profiles as (ICandidateProfile & { userId: { name: string, email: string, image?: string } })[];
    });
  }
}

export const candidateProfileService = new CandidateProfileService();
