import mongoose from 'mongoose';
import UserSchema, { IUser } from './user.model';
import CompanySchema, { ICompany } from './company.model';

// Olası yeniden derleme hatalarını önlemek için singleton deseni
const models = {
  User: mongoose.models.User || mongoose.model<IUser>('User', UserSchema.schema),
  Company: mongoose.models.Company || mongoose.model<ICompany>('Company', CompanySchema.schema),
  // Yeni modeller buraya eklenecek
};

export const { User, Company } = models;
export type { IUser, ICompany }; 