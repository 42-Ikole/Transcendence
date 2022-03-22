import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Match } from 'src/orm/entities/match.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Match])],
  exports: [UserService],
  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {}
