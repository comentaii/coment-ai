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

  /**
   * Finds all candidate profiles, and populates the user data.
   * @returns A list of all candidate profiles with their associated user details.
   */
  async findAllPopulated(): Promise<(ICandidateProfile & { userId: { name: string, email: string, image?: string } })[]> {
    return this.executeWithErrorHandling(async () => {
      const profiles = await this.model
        .find({})
        .populate<{ userId: { name: string, email: string, image?: string } }>('userId', 'name email image')
        .sort({ createdAt: -1 })
        .exec();
      return profiles as (ICandidateProfile & { userId: { name: string, email: string, image?: string } })[];
    });
  }

  /**
   * Finds and scores candidates against a given set of skills using a database aggregation pipeline.
   * This is a highly efficient way to match candidates for a job posting.
   * @param companyId The ID of the company to search within.
   * @param requiredSkills The list of skills required for the job.
   * @returns A sorted list of matched candidates with their match score and matched skills.
   */
  async findMatchingCandidates(
    companyId: string | mongoose.Types.ObjectId,
    requiredSkills: string[]
  ): Promise<(ICandidateProfile & { matchScore: number; matchedSkills: string[] })[]> {
    if (!requiredSkills || requiredSkills.length === 0) {
      return [];
    }
  
    return this.executeWithErrorHandling(async () => {
      const aggregationPipeline = [
        // Stage 1: Match candidates belonging to the specified company and who have been analyzed
        {
          $match: {
            companyId: new mongoose.Types.ObjectId(companyId.toString()),
            status: 'analyzed',
            'analysisResult.technicalSkills': { $exists: true, $ne: [] }
          }
        },
        // Stage 2: Add new fields for match calculation
        {
          $addFields: {
            // Create a temporary array of matched skills
            matchedSkills: {
              $filter: {
                input: '$analysisResult.technicalSkills',
                as: 'candidateSkill',
                cond: {
                  $in: [
                    '$$candidateSkill',
                    requiredSkills.map(s => new RegExp(s, 'i')) // Case-insensitive regex match
                  ]
                }
              }
            }
          }
        },
         // A more robust way to find intersections for case-insensitivity
         {
          $addFields: {
            lowerCaseRequiredSkills: requiredSkills.map(s => s.toLowerCase()),
            lowerCaseCandidateSkills: {
              $map: {
                input: '$analysisResult.technicalSkills',
                as: 'skill',
                in: { $toLower: '$$skill' }
              }
            }
          }
        },
        {
          $addFields: {
            matchedSkills: {
              $let: {
                vars: {
                  intersection: { $setIntersection: ['$lowerCaseCandidateSkills', '$lowerCaseRequiredSkills'] }
                },
                in: {
                  $map: {
                    input: '$$intersection',
                    as: 'intersectSkill',
                    in: {
                      $let: {
                        vars: {
                          originalIndex: { $indexOfArray: ['$lowerCaseCandidateSkills', '$$intersectSkill'] }
                        },
                        in: { $arrayElemAt: ['$analysisResult.technicalSkills', '$$originalIndex'] }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        // Stage 3: Calculate the match score
        {
          $addFields: {
            matchScore: {
              $cond: {
                if: { $eq: [requiredSkills.length, 0] },
                then: 0,
                else: {
                  $multiply: [
                    { $divide: [{ $size: '$matchedSkills' }, requiredSkills.length] },
                    100
                  ]
                }
              }
            }
          }
        },
        // Stage 4: Filter out candidates with a match score of 0
        {
          $match: {
            matchScore: { $gt: 0 }
          }
        },
        // Stage 5: Sort by match score in descending order
        {
          $sort: {
            matchScore: -1
          }
        },
        // Stage 6: Populate user details
        {
          $lookup: {
            from: 'users', // The actual name of the users collection in the DB
            localField: 'userId',
            foreignField: '_id',
            as: 'userId'
          }
        },
        // Stage 7: Deconstruct the userId array from the lookup
        {
          $unwind: '$userId'
        },
        // Stage 8: Project the final desired fields
        {
          $project: {
            // Exclude temporary fields
            lowerCaseRequiredSkills: 0,
            lowerCaseCandidateSkills: 0
          }
        }
      ];

      const matchedCandidates = await this.model.aggregate(aggregationPipeline);
      return matchedCandidates as (ICandidateProfile & { matchScore: number; matchedSkills: string[] })[];
    });
  }
}

export const candidateProfileService = new CandidateProfileService();

