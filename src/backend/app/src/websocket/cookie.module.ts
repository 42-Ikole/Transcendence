import { Module } from '@nestjs/common';
import { CookieService } from './cookie.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [ConfigModule, UserModule],
  providers: [CookieService],
  exports: [CookieService],
})
export class CookieModule {}
