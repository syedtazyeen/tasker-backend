import { Model } from 'mongoose';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.schema';
import { UserStatus } from '@/src/common/enums';
import { UpdateUserReqDto } from './users.dto';
import { RegisterAuthReqDto } from '../auth/auth.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(user: RegisterAuthReqDto): Promise<User> {
    try {
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (error) {
      if ((error as any)?.code === 11000) {
        throw new ConflictException(
          (error as any)?.message || 'Duplicate value for a unique field.',
        );
      }

      throw error;
    }
  }

  async findMany(projectId?: string, searchQuery?: string): Promise<User[]> {
    const query: Record<string, any> = {};
    if (projectId) {
      query.projectId = projectId;
    }
    if (searchQuery) {
      query.name = { $regex: searchQuery, $options: 'i' };
    }
    return await this.userModel.find(query).select('-password').exec();
  }

  async findOne(
    id: string,
    includePassword: boolean = false,
  ): Promise<User | null> {
    if (includePassword) return await this.userModel.findById(id).exec();
    return await this.userModel.findById(id).select('-password').exec();
  }

  async findOneByEmail(
    email: string,
    includePassword: boolean = false,
  ): Promise<User | null> {
    if (includePassword) return await this.userModel.findOne({ email }).exec();
    return await this.userModel.findOne({ email }).select('-password').exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserReqDto,
  ): Promise<User | null> {
    return await this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async verify(id: string, verifed: boolean): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { isVerified: verifed }, { new: true })
      .exec();
  }

  async updateStatus(id: string, status: UserStatus): Promise<void> {
    await this.userModel
      .findByIdAndUpdate(id, { status: status }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }
}
