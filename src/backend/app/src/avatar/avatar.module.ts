import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Avatar } from 'src/orm/entities/avatar.entity';
import { AvatarService } from 'src/avatar/avatar.service';

@Module({
  imports: [TypeOrmModule.forFeature([Avatar])],
  exports: [AvatarService],
  providers: [AvatarService],
})
export class AvatarModule {}
