import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementService } from './achievements.service';
import { AchievementController } from './achievements.controller';
import { Achievement } from 'src/orm/entities/achievement.entity';
import { MatchModule } from 'src/match/match.module';
import { User } from 'src/orm/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement, User]), MatchModule],
  exports: [AchievementService],
  providers: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
