import mongoose from 'mongoose';
import { JobApplication } from '@/schemas/job-application.model';
import { CandidateProfile } from '@/schemas/candidate-profile.model';
import JobPosting from '@/schemas/job-posting.model';
import { geminiService } from '@/services/ai/gemini.service';

class JobMatchingService {
  /**
   * Starts the asynchronous process of matching all relevant candidates to a specific job posting
   * @param jobPostingId - The ID of the job posting.
   * @param companyId - The ID of the company.
   */
  public async startMatchingForJob(jobPostingId: string, companyId: string) {
    console.log(`[JobMatchingService] Starting matching for job: ${jobPostingId}`);

    try {
      const jobPosting = await JobPosting.findById(jobPostingId);
      if (!jobPosting) throw new Error('Job posting not found.');

      // Daha önce eşleştirilmiş adayları bul
      const alreadyMatchedIds = (await JobApplication.find({ jobPosting: jobPostingId }).select('candidateProfile')).map(app => app.candidateProfile);
      
      // Eşleştirilmemiş ve analiz edilmiş adayları bul
      const candidatesToProcess = await CandidateProfile.find({
        companyId: companyId,
        status: 'analyzed',
        'analysisResult.summary': { $exists: true },
        _id: { $nin: alreadyMatchedIds },
      });

      console.log(`[JobMatchingService] Found ${candidatesToProcess.length} candidates to process.`);

      // İş ilanı metnini hazırla
      const jobPostingText = `Title: ${jobPosting.title}\nDescription: ${jobPosting.description}\nRequired Skills: ${jobPosting.skills.join(', ')}`;

      let processedCount = 0;
      let successCount = 0;

      // Her aday için eşleştirme yap
      for (const candidate of candidatesToProcess) {
        if (!candidate.analysisResult) continue;

        try {
          // Aday profil özetini hazırla
          const candidateProfileText = `
            Summary: ${candidate.analysisResult.summary}
            Experience Level: ${candidate.analysisResult.experienceLevel}
            Technical Skills: ${candidate.analysisResult.technicalSkills?.join(', ') || 'Not specified'}
          `;

          // Gemini ile eşleştirme skoru hesapla
          const { matchScore, matchExplanation } = await geminiService.calculateSemanticMatch(
            candidateProfileText.trim(), 
            jobPostingText
          );

          // Eşleştirme sonucunu veritabanına kaydet
          await JobApplication.create({
            jobPosting: jobPostingId,
            candidateProfile: candidate._id,
            company: companyId,
            status: 'matched',
            matchScore,
            matchExplanation,
          });

          successCount++;
          console.log(`[JobMatchingService] Successfully matched candidate ${candidate._id} with score ${matchScore}`);

        } catch (error) {
          console.error(`[JobMatchingService] Error processing candidate ${candidate._id}:`, error);
        } finally {
          processedCount++;
        }
      }

      console.log(`[JobMatchingService] Finished matching for job: ${jobPostingId}. Processed: ${processedCount}, Success: ${successCount}`);

    } catch (error) {
      console.error(`[JobMatchingService] Critical error during matching for job ${jobPostingId}:`, error);
      throw error;
    }
  }

  /**
   * Manually triggers matching for a specific job posting (for when new candidates are added)
   * @param jobPostingId - The ID of the job posting.
   * @param companyId - The ID of the company.
   */
  public async manualMatchForJob(jobPostingId: string, companyId: string) {
    console.log(`[JobMatchingService] Manual matching triggered for job: ${jobPostingId}`);
    return this.startMatchingForJob(jobPostingId, companyId);
  }

  /**
   * Matches a specific candidate to a specific job posting
   * @param candidateId - The ID of the candidate.
   * @param jobPostingId - The ID of the job posting.
   * @param companyId - The ID of the company.
   */
  public async matchCandidateToJob(candidateId: string, jobPostingId: string, companyId: string) {
    try {
      const candidate = await CandidateProfile.findById(candidateId);
      const jobPosting = await JobPosting.findById(jobPostingId);

      if (!candidate || !jobPosting) {
        throw new Error('Candidate or job posting not found.');
      }

      if (!candidate.analysisResult) {
        throw new Error('Candidate profile not analyzed yet.');
      }

      // Daha önce eşleştirilmiş mi kontrol et
      const existingMatch = await JobApplication.findOne({
        jobPosting: jobPostingId,
        candidateProfile: candidateId,
      });

      if (existingMatch) {
        throw new Error('Candidate already matched to this job posting.');
      }

      // Aday profil özetini hazırla
      const candidateProfileText = `
        Summary: ${candidate.analysisResult.summary}
        Experience Level: ${candidate.analysisResult.experienceLevel}
        Technical Skills: ${candidate.analysisResult.technicalSkills?.join(', ') || 'Not specified'}
      `;

      // İş ilanı metnini hazırla
      const jobPostingText = `Title: ${jobPosting.title}\nDescription: ${jobPosting.description}\nRequired Skills: ${jobPosting.skills.join(', ')}`;

      // Gemini ile eşleştirme skoru hesapla
      const { matchScore, matchExplanation } = await geminiService.calculateSemanticMatch(
        candidateProfileText.trim(), 
        jobPostingText
      );

      // Eşleştirme sonucunu veritabanına kaydet
      const jobApplication = await JobApplication.create({
        jobPosting: jobPostingId,
        candidateProfile: candidateId,
        company: companyId,
        status: 'matched',
        matchScore,
        matchExplanation,
      });

      console.log(`[JobMatchingService] Successfully matched candidate ${candidateId} to job ${jobPostingId} with score ${matchScore}`);
      
      return jobApplication;

    } catch (error) {
      console.error(`[JobMatchingService] Error matching candidate ${candidateId} to job ${jobPostingId}:`, error);
      throw error;
    }
  }

  /**
   * Gets matched candidates for a specific job posting
   * @param jobPostingId - The ID of the job posting.
   * @returns Array of matched candidates with their match scores and explanations.
   */
  public async getMatchedCandidates(jobPostingId: string) {
    try {
      const matchedApplications = await JobApplication.find({
        jobPosting: jobPostingId,
        status: 'matched'
      })
      .populate('candidateProfile')
      .sort({ matchScore: -1 })
      .lean()
      .exec();

      return matchedApplications.map(app => {
        const candidateProfile = app.candidateProfile as any;
        return {
          ...candidateProfile,
          matchScore: app.matchScore,
          matchExplanation: app.matchExplanation,
          matchedSkills: app.matchedSkills || []
        };
      });
    } catch (error) {
      console.error(`[JobMatchingService] Error getting matched candidates for job ${jobPostingId}:`, error);
      return [];
    }
  }

  /**
   * Gets all candidates that could potentially match a job posting (including unmatched ones)
   * @param jobPostingId - The ID of the job posting.
   * @param companyId - The ID of the company.
   * @returns Object containing matched and unmatched candidates.
   */
  public async getCandidatesForJob(jobPostingId: string, companyId: string) {
    try {
      // Eşleştirilmiş adayları al
      const matchedApplications = await JobApplication.find({
        jobPosting: jobPostingId,
        status: 'matched'
      })
      .populate('candidateProfile')
      .sort({ matchScore: -1 })
      .lean()
      .exec();

      // Eşleştirilmemiş adayları al
      const matchedCandidateIds = matchedApplications.map(app => app.candidateProfile);
      const unmatchedCandidates = await CandidateProfile.find({
        companyId: companyId,
        status: 'analyzed',
        'analysisResult.summary': { $exists: true },
        _id: { $nin: matchedCandidateIds },
      }).lean().exec();

      return {
        matched: matchedApplications.map(app => ({
          ...app.candidateProfile,
          matchScore: app.matchScore,
          matchExplanation: app.matchExplanation,
          matchedSkills: app.matchedSkills || []
        })),
        unmatched: unmatchedCandidates
      };
    } catch (error) {
      console.error(`[JobMatchingService] Error getting candidates for job ${jobPostingId}:`, error);
      return { matched: [], unmatched: [] };
    }
  }
}

export const jobMatchingService = new JobMatchingService();
