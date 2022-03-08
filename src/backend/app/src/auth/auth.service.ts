import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { IUser } from 'src/user/user.interface';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(user: IUser) {
    const user_db = await this.findUser(user);
    if (!user_db) {
      return await this.createUser(user);
    }
    console.log('Found user:', user_db);
    return user_db;
  }

  async createUser(user: IUser) {
    console.log('Creating User:', user);
    return await this.userService.addUser(user);
  }

  async findUser(user: IUser) {
    return this.userService.findUser(user);
  }
}
