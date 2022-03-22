import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { config } from './orm/ormconfig';
import { UserModule } from './user/user.module';
import { PassportModule } from '@nestjs/passport';
import { MatchModule } from './match/match.module';
import { TwoFactorModule } from './2FA/twofactor.module';
import { ConfigModule } from '@nestjs/config';
import { configModuleOptions } from './config/options';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    MatchModule,
    AuthModule,
    TwoFactorModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot(configModuleOptions),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
