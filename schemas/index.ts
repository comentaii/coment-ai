import mongoose from 'mongoose';
import UserSchema, { IUser } from './user.model';
import CompanySchema, { ICompany } from './company.model';
import ChallengeSchema, { IChallenge } from './challenge.model';
import InterviewSchema, { IInterview } from './interview.model';

const models = {
  User: mongoose.models.User || mongoose.model<IUser>('User', UserSchema),
  Company: mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema),
  Challenge: mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', ChallengeSchema),
  Interview: mongoose.models.Interview || mongoose.model<IInterview>('Interview', InterviewSchema),
};

export const { User, Company, Challenge, Interview } = models;

export type { IUser, ICompany, IChallenge, IInterview }; 