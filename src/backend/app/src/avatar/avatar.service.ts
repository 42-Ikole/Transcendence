import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Avatar, avatarData } from 'src/orm/entities/avatar.entity';

@Injectable()
export class AvatarService {
  constructor(
    @InjectRepository(Avatar) private avatarRepository: Repository<Avatar>,
  ) {}

  async uploadAvatar(file: avatarData) {
    const newFile = await this.avatarRepository.create({
      filename: file.fileName,
      data: file.raw
    })
    await this.avatarRepository.save(newFile);
    return newFile;
  }
 
  async getAvatarById(id: number) {
    const file = await this.avatarRepository.findOne(id);
    if (!file) {
		// set default file here
    }
    return file;
  }

}
