import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';
import { PongGateway } from './pong.gateway';

@Module({
	imports: [UserModule, ConfigModule],
	providers: [PongGateway]
})
export class PongModule {}
