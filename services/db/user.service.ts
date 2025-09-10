import { BaseService } from './base.service';
import { User, IUser } from '@/schemas/user.model';
import bcrypt from 'bcryptjs';

export class UserService extends BaseService<IUser> {
  constructor() {
    super(User);
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    return this.executeWithErrorHandling(async () => {
      // Hash password if provided
      if (userData.password) {
        userData.password = await bcrypt.hash(userData.password, 12);
      }

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
      return this.model.findOne({ email: email.toLowerCase() }).select('+password').exec();
    });
  }

  async verifyPassword(user: IUser, password: string): Promise<boolean> {
    if (!user.password) return false;
    return bcrypt.compare(password, user.password);
  }

  async updateUser(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      // Hash password if it's being updated
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 12);
      }

      return this.model.findByIdAndUpdate(id, updateData, { new: true }).exec();
    });
  }

  async findUsersByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ companyId }).exec();
    });
  }

  async findUsersByRole(role: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ roles: role }).exec();
    });
  }

  async findUsersByRoles(roles: string[]): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ roles: { $in: roles } }).exec();
    });
  }

  async findActiveUsersByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ companyId, isActive: true }).exec();
    });
  }

  async findCandidatesByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find({ 
        companyId, 
        isActive: true,
        roles: { $in: ['candidate'] }
      }).exec();
    });
  }

  async findInterviewersByCompany(companyId: string): Promise<IUser[]> {
    return this.executeWithErrorHandling(async () => {
      const query = { 
        companyId, 
        roles: { $in: ['hr_manager', 'technical_interviewer'] }
      };
      
      console.log('Query for interviewers:', query);
      
      const result = await this.model.find(query).exec();
      console.log('Query result count:', result.length);
      console.log('Query result:', result.map(u => ({ id: u._id, name: u.name, roles: u.roles, isActive: u.isActive, companyId: u.companyId })));
      
      return result;
    });
  }

  async updateUserRoles(id: string, roles: string[]): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(id, { roles }, { new: true }).exec();
    });
  }

  async deactivateUser(id: string): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
    });
  }

  async activateUser(id: string): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(id, { isActive: true }, { new: true }).exec();
    });
  }

  async updateLastLogin(id: string): Promise<IUser | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(id, { lastLoginAt: new Date() }, { new: true }).exec();
    });
  }
}

export const userService = new UserService(); 