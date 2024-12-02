import { Model } from 'mongoose';
import { MongoError } from 'mongodb';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './users.entity';
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
      if (error instanceof MongoError && error.code === 11000) {
        const errorMessage = error.errmsg || '';

        // Regex with the global flag to match multiple occurrences of duplicate fields
        const duplicateFieldMatches = [
          ...errorMessage.matchAll(/index: (\w+)_1 dup key/g),
        ];

        const duplicateEmailField = duplicateFieldMatches.find(
          (match) => match[0] === 'email' || match[1] === 'email',
        );

        if (duplicateEmailField) {
          throw new ConflictException('Email already exists');
        }

        throw new ConflictException('Duplicate value for a unique field.');
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
