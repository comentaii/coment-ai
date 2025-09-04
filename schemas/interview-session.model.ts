import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewSession extends Document {
  companyId: mongoose.Types.ObjectId;
  jobPostingId: mongoose.Types.ObjectId;
  interviewerId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  masterLink: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSessionSchema = new Schema<IInterviewSession>({
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
    index: true
  },
  jobPostingId: {
    type: Schema.Types.ObjectId,
    ref: 'JobPosting',
    required: true,
    index: true
  },
  interviewerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  scheduledDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['scheduled', 'active', 'completed', 'cancelled'],
    default: 'scheduled',
    index: true
  },
  masterLink: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  collection: 'interview_sessions'
});

// Compound indexes for efficient queries
InterviewSessionSchema.index({ companyId: 1, scheduledDate: 1 });
InterviewSessionSchema.index({ interviewerId: 1, status: 1 });
InterviewSessionSchema.index({ jobPostingId: 1, status: 1 });

// Prevent model overwrite error in development
export const InterviewSession = mongoose.models.InterviewSession || mongoose.model<IInterviewSession>('InterviewSession', InterviewSessionSchema);
