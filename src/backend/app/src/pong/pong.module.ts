import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MatchModule } from 'src/match/match.module';
import { UserModule } from 'src/user/user.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';
import { SocketModule } from 'src/websocket/socket.module';
import { CookieModule } from 'src/websocket/cookie.module';

@Module({
  imports: [UserModule, ConfigModule, MatchModule, SocketModule, CookieModule],
  controllers: [PongController],
  providers: [PongGateway, PongService],
})
export class PongModule {}
