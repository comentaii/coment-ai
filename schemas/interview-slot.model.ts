import mongoose, { Document, Schema } from 'mongoose';

export interface IInterviewSlot extends Document {
  sessionId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  candidateLink: string;
  status: 'pending' | 'active' | 'completed' | 'no-show' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in minutes
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InterviewSlotSchema = new Schema<IInterviewSlot>({
  sessionId: {
    type: Schema.Types.ObjectId,
    ref: 'InterviewSession',
    required: true,
    index: true
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'CandidateProfile',
    required: true,
    index: true
  },
  candidateLink: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'no-show', 'cancelled'],
    default: 'pending',
    index: true
  },
  startTime: {
    type: Date,
    index: true
  },
  endTime: {
    type: Date,
    index: true
  },
  duration: {
    type: Number,
    min: 5,
    max: 480 // 8 hours max
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true,
  collection: 'interview_slots'
});

// Compound indexes for efficient queries
InterviewSlotSchema.index({ sessionId: 1, status: 1 });
InterviewSlotSchema.index({ candidateId: 1, status: 1 });
InterviewSlotSchema.index({ sessionId: 1, candidateId: 1 }, { unique: true });

// Prevent model overwrite error in development
export const InterviewSlot = mongoose.models.InterviewSlot || mongoose.model<IInterviewSlot>('InterviewSlot', InterviewSlotSchema);
