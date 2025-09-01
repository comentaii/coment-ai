import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'super_admin' | 'hr_manager' | 'technical_interviewer' | 'candidate';
  company?: mongoose.Types.ObjectId;
  image?: string;
  emailVerified?: Date;
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
  role: {
    type: String,
    enum: ['super_admin', 'hr_manager', 'technical_interviewer', 'candidate'],
    default: 'candidate',
    required: true
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company',
    required: false
  },
  image: {
    type: String,
    default: null
  },
  emailVerified: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password') || !this.password) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ company: 1 });

export default userSchema; 