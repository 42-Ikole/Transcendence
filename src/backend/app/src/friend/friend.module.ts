import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelation } from 'src/orm/entities/friend.entity';
import { StatusModule } from 'src/status/status.module';
import { UserModule } from 'src/user/user.module';
import { FriendController } from './friend.controller';
import { FriendService } from "./friend.service";

@Module({
  imports: [UserModule, StatusModule, TypeOrmModule.forFeature([UserRelation])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
