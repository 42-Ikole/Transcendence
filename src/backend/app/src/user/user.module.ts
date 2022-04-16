import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { AvatarService } from 'src/avatar/avatar.service';
import { Avatar } from 'src/orm/entities/avatar.entity';
import { SocketModule } from 'src/websocket/socket.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, Avatar]), SocketModule],
  exports: [UserService],
  providers: [UserService, AvatarService],
  controllers: [UserController],
})
export class UserModule {}
