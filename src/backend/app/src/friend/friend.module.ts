import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AchievementModule } from 'src/achievements/achievements.module';
import { Friend } from 'src/orm/entities/friend.entity';
import { StatusModule } from 'src/status/status.module';
import { UserModule } from 'src/user/user.module';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';

@Module({
  imports: [UserModule, StatusModule, TypeOrmModule.forFeature([Friend]), AchievementModule],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
