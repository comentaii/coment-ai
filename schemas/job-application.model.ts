import mongoose, { Document, Schema, Model } from 'mongoose';

// Interface for the JobApplication document
export interface IJobApplication extends Document {
  jobPosting: mongoose.Types.ObjectId;
  candidateProfile: mongoose.Types.ObjectId;
  company: mongoose.Types.ObjectId;
  status: 'pending' | 'matched' | 'rejected' | 'archived';
  matchScore?: number;
  matchExplanation?: string;
  matchedSkills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Mongoose Schema for JobApplication
const JobApplicationSchema: Schema<IJobApplication> = new Schema(
  {
    jobPosting: {
      type: Schema.Types.ObjectId,
      ref: 'JobPosting',
      required: true,
      index: true,
    },
    candidateProfile: {
      type: Schema.Types.ObjectId,
      ref: 'CandidateProfile',
      required: true,
      index: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'matched', 'rejected', 'archived'],
      default: 'pending',
    },
    matchScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    matchExplanation: {
      type: String,
    },
    matchedSkills: {
      type: [String],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    versionKey: false,
    collection: 'jobApplications',
  }
);

// To prevent re-defining the model every time, which can happen in serverless environments
const JobApplication: Model<IJobApplication> =
  mongoose.models.JobApplication || mongoose.model<IJobApplication>('JobApplication', JobApplicationSchema);

export { JobApplication, JobApplicationSchema };
