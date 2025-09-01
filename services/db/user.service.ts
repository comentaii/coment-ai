import { BaseService } from './base.service';
import { User, IUser } from '@/schemas';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { USER_ROLES } from '@/lib/constants';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.executeWithErrorHandling(async () => {
      const user = new this.model(userData);
      return user.save();
    });
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findOne({ email: email.toLowerCase() }).exec();
    });
  }

  async findByEmailWithPassword(email: string): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findOne({ email: email.toLowerCase() }).select('+password company').exec();
    });
  }

  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      // Şifre hash'leme işlemi Mongoose pre-save hook'u tarafından yapılacak.
      return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    });
  }

  async findUsersByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId }).exec();
    });
  }

  async findUsersByRole(role: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ role }).exec();
    });
  }

  async findByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId }).exec();
    });
  }

  /**
   * Bir şirketteki adayları (candidate rolü) getirir.
   */
  async findCandidatesByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId, role: USER_ROLES.CANDIDATE }).exec();
    });
  }

  /**
   * Bir şirketteki mülakatçıları (technical_interviewer rolü) getirir.
   */
  async findInterviewersByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ company: companyId, role: USER_ROLES.TECHNICAL_INTERVIEWER }).exec();
    });
  }
}

const userService = new UserService();
export default userService; 