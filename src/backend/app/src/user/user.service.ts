import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/orm/entities/user.entity';
import { IUser } from 'src/user/user.interface';

function validateNumber(num: string): void {
  if (isNaN(parseInt(num))) {
    console.log('validateNumber: throwing exception...');
    throw new HttpException(
      'invalid parameter: expected number: [' + num + ']',
      HttpStatus.BAD_REQUEST,
    );
  }
}

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  private createFromDto(userDTO: IUser): User {
    return this.usersRepository.create(userDTO);
  }

  async addUser(userDTO: IUser) {
    const user = this.createFromDto(userDTO);
    return await this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findOne(id: string): Promise<User> {
    validateNumber(id);
    return this.usersRepository.findOne(id);
  }

  async findUser(user: IUser): Promise<User | undefined> {
    return this.usersRepository.findOne({ intraId: user.intraId });
  }

  async remove(id: string): Promise<void> {
    validateNumber(id);
    await this.usersRepository.delete(id);
  }
}
