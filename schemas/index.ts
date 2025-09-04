import mongoose from 'mongoose';
import { User as UserModel, IUser } from './user.model';
import { Company as CompanyModel, ICompany } from './company.model';
import { Challenge as ChallengeModel, IChallenge } from './challenge.model';
import { Interview as InterviewModel, IInterview } from './interview.model';

const models = {
  User: UserModel,
  Company: CompanyModel,
  Challenge: ChallengeModel,
  Interview: InterviewModel,
};

export const { User, Company, Challenge, Interview } = models;

export type { IUser, ICompany, IChallenge, IInterview }; 