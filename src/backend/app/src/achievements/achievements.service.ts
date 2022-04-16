import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Achievement } from 'src/orm/entities/achievement.entity';
import { ACHIEVEMENTS } from './achievements';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement) private achievementRepository: Repository<Achievement>,
  ) {}

  async findAll(options?: FindManyOptions<Achievement>) {
	  return this.achievementRepository.find(options);
  }

  async seedDatabase() {
    for (let achievement of ACHIEVEMENTS) {
      const found = await this.achievementRepository.findOne({ id: achievement.id });
      if (found) {
        continue;
      }
      const entity = this.achievementRepository.create(achievement);
      await this.achievementRepository.save(entity);
    }
  }
}
