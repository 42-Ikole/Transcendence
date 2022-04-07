import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from 'src/orm/entities/match.entity';
import { MatchService } from 'src/match/match.service';
import { MatchController } from './match.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Match])],
  exports: [MatchService],
  providers: [MatchService],
  controllers: [MatchController],
})
export class MatchModule {}
