import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './user.model';
import { IChallenge } from './challenge.model';
import { ICompany } from './company.model';

export interface IInterview extends Document {
  candidate: mongoose.Types.ObjectId | IUser;
  interviewer: mongoose.Types.ObjectId | IUser;
  challenge: mongoose.Types.ObjectId | IChallenge;
  company: mongoose.Types.ObjectId | ICompany;
  status: 'Pending' | 'InProgress' | 'Completed';
  code: string;
  notes: string;
  scheduledAt: Date;
  completedAt?: Date;
}

const InterviewSchema: Schema<IInterview> = new Schema(
  {
    candidate: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    interviewer: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: 'Challenge',
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'InProgress', 'Completed'],
      default: 'Pending',
    },
    code: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default InterviewSchema;
