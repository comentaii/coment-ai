import mongoose from 'mongoose';
import UserSchema, { IUser } from './user.model';
import CompanySchema, { ICompany } from './company.model';
import ChallengeSchema, { IChallenge } from './challenge.model';
import InterviewSchema, { IInterview } from './interview.model';

export { default as JobApplicationSchema } from './job-application.model';
export { default as JobPostingSchema } from './job-posting.model';
export { User as UserSchema } from './user.model';
export { Company as CompanySchema } from './company.model';
export { default as InterviewSessionSchema } from './interview-session.model';
export { default as InterviewSlotSchema } from './interview-slot.model';
export { default as CandidateProfileSchema } from './candidate-profile.model';

export * from './user.model';
export * from './company.model';
export * from './job-posting.model';
export * from './job-application.model';
export * from './interview-session.model';
export * from './interview-slot.model';
export * from './candidate-profile.model';

export type { IUser, ICompany, IChallenge, IInterview }; 