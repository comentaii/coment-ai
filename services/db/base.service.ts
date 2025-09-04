import { Model, Document, FilterQuery } from 'mongoose';
import { connectToDatabase } from '@/lib/db';

export abstract class BaseService<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
    this.ensureConnection();
  }

  protected async ensureConnection(): Promise<void> {
    await connectToDatabase();
  }

  protected async executeWithErrorHandling<TResult>(
    operation: () => Promise<TResult>
  ): Promise<TResult> {
    try {
      return await operation();
    } catch (error) {
      console.error(`Error in ${this.constructor.name}:`, error);
      throw error;
    }
  }

  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.executeWithErrorHandling(async () => {
      return this.model.find(filter).exec();
    });
  }

  async findById(id: string): Promise<T | null> {
    this.validateId(id);
    return this.executeWithErrorHandling(async () => {
      return this.model.findById(id).exec();
    });
  }

  async create(data: Partial<T>): Promise<T> {
    return this.executeWithErrorHandling(async () => {
      const entity = new this.model(data);
      return entity.save();
    });
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    return this.executeWithErrorHandling(async () => {
      return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    });
  }

  async delete(id: string): Promise<boolean> {
    return this.executeWithErrorHandling(async () => {
      const result = await this.model.findByIdAndDelete(id).exec();
      return !!result;
    });
  }
} 