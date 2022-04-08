import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar, AvatarData } from 'src/orm/entities/avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
  ) {}

  async uploadAvatar(file: AvatarData) {
    const newFile = this.avatarRepository.create({
      filename: file.filename,
      data: file.data
    });
    return await this.avatarRepository.save(newFile);
  }
 
  async getAvatarById(id: number) {
    const file = await this.avatarRepository.findOne(id);
    if (!file) {
    // set default file here
      throw new NotFoundException();
    }
    return file;
  }
}
