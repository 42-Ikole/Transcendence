import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementService } from './achievements.service';
import { AchievementController } from './achievements.controller';
import { Achievement } from 'src/orm/entities/achievement.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Achievement])],
  exports: [AchievementService],
  providers: [AchievementService],
  controllers: [AchievementController],
})
export class AchievementModule {}
