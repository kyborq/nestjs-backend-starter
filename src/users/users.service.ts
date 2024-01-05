import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async getByEmail(email: string) {
    const user = this.userModel.findOne({ email });
    return user.exec();
  }

  async getById(userId: string): Promise<User> {
    const user = this.userModel.findById(userId);
    return user.exec();
  }

  async updateToken(userId: string, token: string | null): Promise<User> {
    const updatedUser = this.userModel.findByIdAndUpdate(userId, { token });
    return updatedUser.exec();
  }
}
