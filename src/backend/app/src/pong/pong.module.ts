import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { PongController } from './pong.controller';
import { PongGateway } from './pong.gateway';
import { PongService } from './pong.service';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [PongController],
  providers: [PongGateway, PongService],
})
export class PongModule {}
