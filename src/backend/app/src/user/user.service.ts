import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, PartialUser } from 'src/orm/entities/user.entity';
import { IUser } from 'src/user/user.interface';
import { Match } from 'src/orm/entities/match.entity';

@Injectable()
export class UserService {
  constructor(
	@InjectRepository(User) private userRepository: Repository<User>,
	@InjectRepository(Match) private matchRepository: Repository<Match>
  ) {}

////////////
// Create //
////////////

	createUser(user: User): Promise<User> {
		// creates user entity
		const newUser = this.userRepository.create(user);

		// inserts if not exists, otherwise its an update
		return this.userRepository.save(newUser);
	}

/////////////
// Getters //
/////////////

  private createFromDto(userDTO: IUser): User {
    return this.userRepository.create(userDTO);
  }

  async addUser(userDTO: IUser) {
    const user = this.createFromDto(userDTO);
    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findById(id: number): Promise<User> {
    return this.userRepository.findOne(id);
  }

  async findByIntraId(user: IUser): Promise<User | undefined> {
    return this.userRepository.findOne({ intraId: user.intraId });
  }

  async findWins(id: number) {
	  return (await this.userRepository.findOne(id, {relations: ['wins']})).wins;
	}
	
	async findLosses(id: number) {
		return (await this.userRepository.findOne(id, {relations: ['losses']})).losses;
  }

////////////
// Update //
////////////

	async update(id: number, field: PartialUser) {
		console.log("part:", field);
		return this.userRepository.update(id, field);
	}

////////////
// Delete //
////////////

	async delete(id: number): Promise<User>
	{
		const user = await this.findById(id);
	
		return this.userRepository.remove(user);
	}

}
