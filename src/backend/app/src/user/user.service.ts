import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/orm/entities/user.entity';
import { IUser } from 'src/user/user.interface';
import { Match } from 'src/orm/entities/match.entity';

@Injectable()
export class UserService {
  constructor(
	@InjectRepository(User) private usersRepository: Repository<User>,
	@InjectRepository(Match) private matchRepository: Repository<Match>
  ) {}

////////////
// Create //
////////////
	createUser(user: User): Promise<User>
	{
	// creates user entity
	const newUser = this.usersRepository.create(user);

	// inserts if not exists, otherwise its an update
	return this.usersRepository.save(newUser);
	}

/////////////
// Getters //
/////////////
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

  async findOne(id: number): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async findUser(user: IUser): Promise<User | undefined> {
    return this.usersRepository.findOne({ intraId: user.intraId });
  }

  // TODO: change any to partial user type
  async updateUser(id: number, partialUser: any) {
    return this.usersRepository.update(id, partialUser);
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async findMatches(id: number) {
	  await this.matchRepository.find({ relations: ['winner']})
  }
}
