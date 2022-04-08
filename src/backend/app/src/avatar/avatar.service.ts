import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar, AvatarData } from 'src/orm/entities/avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
  ) {}

  findAll() {
    return this.avatarRepository.find();
  }

  createAvatar(file: AvatarData) {
    return this.avatarRepository.create(file);
  }

  async uploadAvatar(file: AvatarData) {
    const newFile = this.createAvatar(file);
    return await this.avatarRepository.save(newFile);
  }
 
  async getAvatarById(id: number) {
    const file = await this.avatarRepository.findOne(id);
    if (!file) {
      throw new NotFoundException();
    }
    return file;
  }

  async updateAvatar(id: number, file: AvatarData) {
    await this.avatarRepository.update(id, file);
    return this.getAvatarById(id);
  }
}
