import mongoose, { Document, Schema } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  email: string;
  domain?: string;
  subscriptionPlan: 'basic' | 'premium' | 'enterprise';
  quotas: {
    cvUploads: number;
    interviews: number;
    storageGB: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const companySchema = new Schema<ICompany>({
  name: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true,
    maxlength: [100, 'Company name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Company email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  domain: {
    type: String,
    trim: true,
    lowercase: true
  },
  subscriptionPlan: {
    type: String,
    enum: ['basic', 'premium', 'enterprise'],
    default: 'basic',
    required: true
  },
  quotas: {
    cvUploads: {
      type: Number,
      default: 100
    },
    interviews: {
      type: Number,
      default: 50
    },
    storageGB: {
      type: Number,
      default: 10
    }
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
// Note: email index is already created by unique: true in schema
companySchema.index({ domain: 1 });
companySchema.index({ isActive: 1 });

export const Company = mongoose.models.Company || mongoose.model<ICompany>('Company', companySchema); 