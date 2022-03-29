import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { CookieModule } from 'src/websocket/cookie.module';
import { StatusService } from './status.service';
import { SocketModule } from 'src/websocket/socket.module';
import { StatusController } from './status.controller';

@Module({
  imports: [SocketModule, CookieModule],
  controllers: [StatusController],
  providers: [StatusGateway, StatusService],
  exports: [StatusService],
})
export class StatusModule {}
