import { Module } from '@nestjs/common';
import { MatchService } from './match.service';
import { MatchController } from './match.controller';

@Module({
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
