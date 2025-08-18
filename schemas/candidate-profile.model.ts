import mongoose, { Document, Schema } from 'mongoose';

// This interface can be expanded with more detailed analysis fields later.
export interface ICVAnalysisResult {
  fullName: string;
  contactInfo: {
    email?: string;
    phone?: string;
  };
  summary: string;
  skills: string[];
  experienceLevel: 'Junior' | 'Mid-level' | 'Senior' | 'Lead' | 'Unknown';
}

export interface ICandidateProfile extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  companyId: mongoose.Schema.Types.ObjectId;
  cvPath: string; // Path to the uploaded CV file
  analysisResult?: ICVAnalysisResult;
  status: 'pending_analysis' | 'analyzed' | 'error';
  createdAt: Date;
  updatedAt: Date;
}

const CVAnalysisResultSchema = new Schema<ICVAnalysisResult>({
  fullName: { type: String, required: true },
  contactInfo: {
    email: { type: String },
    phone: { type: String },
  },
  summary: { type: String, required: true },
  skills: [{ type: String }],
  experienceLevel: { 
    type: String, 
    enum: ['Junior', 'Mid-level', 'Senior', 'Lead', 'Unknown'], 
    required: true 
  },
}, { _id: false });

const CandidateProfileSchema = new Schema<ICandidateProfile>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // Each user should have only one candidate profile
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  cvPath: {
    type: String,
    required: true,
  },
  analysisResult: {
    type: CVAnalysisResultSchema,
    required: false,
  },
  status: {
    type: String,
    enum: ['pending_analysis', 'analyzed', 'error'],
    default: 'pending_analysis',
  }
}, {
  timestamps: true,
});

CandidateProfileSchema.index({ companyId: 1 });
CandidateProfileSchema.index({ userId: 1 });


export const CandidateProfile = mongoose.models.CandidateProfile || mongoose.model<ICandidateProfile>('CandidateProfile', CandidateProfileSchema);
