import { BaseService } from './base.service';
import { InterviewSession, IInterviewSession } from '@/schemas/interview-session.model';
import { InterviewSlot, IInterviewSlot } from '@/schemas/interview-slot.model';
import { CreateInterviewSessionDto, UpdateInterviewSessionDto } from '@/lib/validation-schemas';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export class InterviewSessionService extends BaseService<IInterviewSession> {
  constructor() {
    super(InterviewSession);
  }

  /**
   * Creates a new interview session with slots for selected candidates
   */
  async createInterviewSession(
    data: CreateInterviewSessionDto,
    companyId: string
  ): Promise<{ session: IInterviewSession; slots: IInterviewSlot[] }> {
    return this.executeWithErrorHandling(async () => {
      // Generate unique master link
      const masterLink = `interview/session/${uuidv4()}/master`;

      // Create interview session
      const session = await this.create({
        companyId: new mongoose.Types.ObjectId(companyId),
        jobPostingId: new mongoose.Types.ObjectId(data.jobPostingId),
        interviewerId: new mongoose.Types.ObjectId(data.interviewerId),
        scheduledDate: data.scheduledDate,
        masterLink,
        notes: data.notes,
        status: 'scheduled'
      });

      // Create slots for each candidate
      const slots: IInterviewSlot[] = [];
      for (const candidateId of data.candidateIds) {
        const candidateLink = `interview/session/${session._id}/candidate/${uuidv4()}`;
        
        const slot = await InterviewSlot.create({
          sessionId: session._id,
          candidateId: new mongoose.Types.ObjectId(candidateId),
          candidateLink,
          status: 'pending'
        });
        
        slots.push(slot);
      }

      return { session, slots };
    });
  }

  /**
   * Gets all interview sessions for a company
   */
  async getSessionsByCompany(
    companyId: string,
    options: {
      status?: string;
      interviewerId?: string;
      jobPostingId?: string;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<IInterviewSession[]> {
    return this.executeWithErrorHandling(async () => {
      const query: any = { companyId: new mongoose.Types.ObjectId(companyId) };
      
      if (options.status) query.status = options.status;
      if (options.interviewerId) query.interviewerId = new mongoose.Types.ObjectId(options.interviewerId);
      if (options.jobPostingId) query.jobPostingId = new mongoose.Types.ObjectId(options.jobPostingId);

      return this.find(query, {
        populate: [
          { path: 'jobPostingId', select: 'title' },
          { path: 'interviewerId', select: 'name email' }
        ],
        sort: { scheduledDate: -1 },
        limit: options.limit || 50,
        skip: options.skip || 0
      });
    });
  }

  /**
   * Gets interview session with all slots
   */
  async getSessionWithSlots(sessionId: string): Promise<{
    session: IInterviewSession;
    slots: IInterviewSlot[];
  } | null> {
    return this.executeWithErrorHandling(async () => {
      const session = await this.findById(sessionId, {
        populate: [
          { path: 'jobPostingId', select: 'title description skills' },
          { path: 'interviewerId', select: 'name email' },
          { path: 'companyId', select: 'name' }
        ]
      });

      if (!session) return null;

      const slots = await InterviewSlot.find({ sessionId: session._id })
        .populate('candidateId', 'analysisResult.fullName analysisResult.contactInfo.email')
        .sort({ createdAt: 1 });

      return { session, slots };
    });
  }

  /**
   * Updates interview session
   */
  async updateInterviewSession(
    sessionId: string,
    data: UpdateInterviewSessionDto
  ): Promise<IInterviewSession | null> {
    return this.executeWithErrorHandling(async () => {
      return this.update(sessionId, data);
    });
  }

  /**
   * Gets sessions by interviewer
   */
  async getSessionsByInterviewer(
    interviewerId: string,
    options: {
      status?: string;
      limit?: number;
      skip?: number;
    } = {}
  ): Promise<IInterviewSession[]> {
    return this.executeWithErrorHandling(async () => {
      const query: any = { interviewerId: new mongoose.Types.ObjectId(interviewerId) };
      
      if (options.status) query.status = options.status;

      return this.find(query, {
        populate: [
          { path: 'jobPostingId', select: 'title' },
          { path: 'companyId', select: 'name' }
        ],
        sort: { scheduledDate: -1 },
        limit: options.limit || 50,
        skip: options.skip || 0
      });
    });
  }

  /**
   * Gets upcoming sessions for a company
   */
  async getUpcomingSessions(companyId: string, limit: number = 10): Promise<IInterviewSession[]> {
    return this.executeWithErrorHandling(async () => {
      return this.find({
        companyId: new mongoose.Types.ObjectId(companyId),
        scheduledDate: { $gte: new Date() },
        status: { $in: ['scheduled', 'active'] }
      }, {
        populate: [
          { path: 'jobPostingId', select: 'title' },
          { path: 'interviewerId', select: 'name email' }
        ],
        sort: { scheduledDate: 1 },
        limit
      });
    });
  }
}

export const interviewSessionService = new InterviewSessionService();
