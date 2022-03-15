import { Module } from '@nestjs/common';
import { TwoFactorService } from './twofactor.service';
import { TwoFactorController } from './twofactor.controller';
import { UserModule } from 'src/user/user.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [UserModule, ConfigModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
})
export class TwoFactorModule {}
