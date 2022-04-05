import { forwardRef, Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { CookieModule } from 'src/websocket/cookie.module';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/orm/entities/user.entity';

@Module({
  imports: [CookieModule, UserModule],
  exports: [StatusService],
  controllers: [StatusController],
  providers: [StatusService, StatusGateway],
})
export class StatusModule {}
