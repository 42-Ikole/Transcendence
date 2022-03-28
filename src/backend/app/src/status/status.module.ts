import { Module } from '@nestjs/common';
import { StatusGateway } from "./status.gateway";
import { CookieModule } from 'src/websocket/cookie.module';
import { StatusService } from './status.service';
import { SocketModule } from 'src/websocket/socket.module';

@Module({
  imports: [SocketModule, CookieModule],
  providers: [StatusGateway, StatusService],
  exports: [StatusService],
})
export class StatusModule {}
