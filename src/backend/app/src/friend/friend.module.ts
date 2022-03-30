import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRelation } from 'src/orm/entities/friend.entity';
import { UserModule } from 'src/user/user.module';
import { FriendController } from './friend.controller';
import { FriendService } from "./friend.service";

@Module({
  imports: [UserModule, TypeOrmModule.forFeature([UserRelation])],
  controllers: [FriendController],
  providers: [FriendService],
})
export class FriendModule {}
