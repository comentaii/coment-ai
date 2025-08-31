import { Schema, model, models, Document, Types } from 'mongoose';
import { USER_ROLES } from '@/lib/constants/roles';

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
      validate: {
        validator: async function (value: Types.ObjectId) {
          const user = await models.User.findById(value);
          return user && (user.role === USER_ROLES.SUPER_ADMIN || user.role === USER_ROLES.HR_MANAGER);
        },
        message: 'Job posting can only be created by a Super Admin or HR Manager.',
      },
    },
  },
  { timestamps: true }
);

const JobPosting = models.JobPosting || model<IJobPosting>('JobPosting', jobPostingSchema);

export default JobPosting;
