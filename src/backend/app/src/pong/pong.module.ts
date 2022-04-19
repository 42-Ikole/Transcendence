import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MatchModule } from 'src/match/match.module';
import { UserModule } from 'src/user/user.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { CookieModule } from 'src/websocket/cookie.module';
import { StatusModule } from 'src/status/status.module';
import { AchievementModule } from 'src/achievements/achievements.module';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    MatchModule,
    CookieModule,
    StatusModule,
    AchievementModule,
  ],
  controllers: [PongController],
  providers: [PongGateway, PongService],
})
export class PongModule {}
