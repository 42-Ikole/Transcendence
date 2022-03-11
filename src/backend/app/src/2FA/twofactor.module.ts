import { Module } from '@nestjs/common';
import { TwoFactorService } from './twofactor.service';
import { TwoFactorController } from './twofactor.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [TwoFactorController],
  providers: [TwoFactorService],
})
export class TwoFactorModule {}
