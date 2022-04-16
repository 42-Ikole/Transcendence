import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, Repository } from 'typeorm';
import { User, PartialUser } from 'src/orm/entities/user.entity';
import { IUser } from 'src/user/user.interface';
import { AvatarService } from 'src/avatar/avatar.service';
import { Avatar, AvatarData } from 'src/orm/entities/avatar.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly avatarService: AvatarService,
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

  async findById(id: number, options?: FindOneOptions<User>): Promise<User> {
    const user = await this.userRepository.findOne(id, options);
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async findByIntraId(user: IUser): Promise<User | undefined> {
    return this.userRepository.findOne({ intraId: user.intraId });
  }

  async findWins(id: number) {
    return (await this.userRepository.findOne(id, { relations: ['wins'] }))
      .wins;
  }

  async findLosses(id: number) {
    return (await this.userRepository.findOne(id, { relations: ['losses'] }))
      .losses;
  }

  async getAvatarById(id: number) {
    const user = await this.findById(id);
    if (!user.avatarId) {
      throw new NotFoundException();
    }
    return this.avatarService.getAvatarById(user.avatarId);
  }

  ////////////
  // Update //
  ////////////

  async addAvatar(id: number, file: AvatarData) {
    const user = await this.findById(id);
    let avatar: Avatar;
    if (user.avatarId) {
      avatar = await this.avatarService.updateAvatar(user.avatarId, file);
    } else {
      avatar = await this.avatarService.uploadAvatar(file);
    }
    await this.userRepository.update(id, { avatarId: avatar.id });
    return avatar;
  }

  async update(id: number, field: PartialUser) {
    console.log('part:', field);
    return await this.userRepository.update(id, field).catch((_reason: any) => {
      console.error('user update failure:', _reason);
      throw new ConflictException();
    });
  }

  ////////////
  // Delete //
  ////////////

  async delete(id: number): Promise<User> {
    const user = await this.findById(id);

    return this.userRepository.remove(user);
  }
}
