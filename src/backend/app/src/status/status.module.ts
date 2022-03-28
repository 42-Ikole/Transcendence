import { Module } from '@nestjs/common';
import { StatusGateway } from "./status.gateway";
import { SocketService } from 'src/websocket/socket.service';
import { CookieModule } from 'src/websocket/cookie.module';

@Module({
  imports: [SocketService, CookieModule],
  providers: [StatusGateway],
})
export class StatusModule {}
