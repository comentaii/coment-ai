import { Schema, model, models, Document, Types } from 'mongoose';
import { USER_ROLES } from '@/lib/constants/roles';
import { User } from './user.model';

export interface IJobPosting extends Document {
  title: string;
  description: string;
  skills: string[];
  company: Types.ObjectId;
  status: 'open' | 'closed' | 'archived';
  linkedinUrl?: string;
  createdBy: Types.ObjectId;
}

const jobPostingSchema = new Schema<IJobPosting>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [{ type: String }],
    company: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    status: {
      type: String,
      enum: ['open', 'closed', 'archived'],
      default: 'open',
    },
    linkedinUrl: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

// Force model recreation to clear cache
delete models['JobPosting'];
const JobPosting = model<IJobPosting>('JobPosting', jobPostingSchema);

export default JobPosting;
