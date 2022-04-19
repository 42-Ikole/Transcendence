import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Achievement } from 'src/orm/entities/achievement.entity';
import { Achievements, ACHIEVEMENTS } from './achievements';
import { User } from 'src/orm/entities/user.entity';
import { MatchService } from 'src/match/match.service';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement)
    private achievementRepository: Repository<Achievement>,
    @InjectRepository(User) private userRepository: Repository<User>,
    private matchService: MatchService,
  ) {}

  async findAll(options?: FindManyOptions<Achievement>) {
    return this.achievementRepository.find(options);
  }

  async seedDatabase() {
    for (const achievement of ACHIEVEMENTS) {
      const found = await this.achievementRepository.findOne({
        id: achievement.id,
      });
      if (found) {
        continue;
      }
      const entity = this.achievementRepository.create(achievement);
      await this.achievementRepository.save(entity);
    }
  }

  async addAchievement(userId: number, achievementId: Achievements) {
    const user = await this.userRepository.findOne(userId, {
      relations: ['achievements'],
    });
    const cheevo = await this.achievementRepository.findOne(achievementId);
    for (const achievement of user.achievements) {
      if (achievement.id === cheevo.id) {
        return;
      }
    }
    user.achievements.push(cheevo);
    console.log(user.id, 'earned', cheevo.name);
    this.userRepository.save(user);
  }

  async checkPongAchievements(userId: number) {
    const stats = await this.matchService.createStats(userId);
    const earned: Achievements[] = [];
    if (stats.winCount + stats.lossCount === 1) {
      earned.push(Achievements.PLAY_GAME);
    }
    if (stats.winCount === 1) {
      earned.push(Achievements.WIN_GAME);
    }
    if (stats.lossCount === 1) {
      earned.push(Achievements.LOSE_GAME);
    }
    if (stats.winCount === 10) {
      earned.push(Achievements.WIN_TEN_GAMES);
    }
    earned.forEach((achievement: Achievements) => {
      this.addAchievement(userId, achievement);
    });
  }
}
