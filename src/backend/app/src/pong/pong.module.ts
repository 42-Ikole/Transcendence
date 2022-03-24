import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [UserModule, ConfigModule],
  providers: [PongGateway, PongService],
})
export class PongModule {}
