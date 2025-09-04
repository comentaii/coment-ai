import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  roles: ('super_admin' | 'hr_manager' | 'technical_interviewer' | 'candidate')[];
  companyId?: string;
  image?: string;
  emailVerified?: Date;
  isActive: boolean;
  invitedBy?: string;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: false, // Password is optional (for OAuth users)
    minlength: [6, 'Password must be at least 6 characters']
  },
  roles: {
    type: [String],
    enum: ['super_admin', 'hr_manager', 'technical_interviewer', 'candidate'],
    default: ['candidate'],
    required: true
  },
  companyId: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: false // Company ID is optional for all users
  },
  image: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  invitedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  lastLoginAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(_doc, ret) {
      delete ret.password;
      return ret;
    }
  }
});

// Index for better query performance
// Note: email index is already created by unique: true in schema
userSchema.index({ roles: 1 });
userSchema.index({ companyId: 1 });
userSchema.index({ isActive: 1 });

export const User = mongoose.models['User'] || mongoose.model<IUser>('User', userSchema); 