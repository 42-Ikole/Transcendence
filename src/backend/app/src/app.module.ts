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
import { PongModule } from './pong/pong.module';
import { SocketModule } from './websocket/socket.module';
import { StatusModule } from './status/status.module';
import { FriendModule } from './friend/friend.module';
import { CookieModule } from './websocket/cookie.module';
import { AvatarModule } from './avatar/avatar.module';
import { AchievementModule } from './achievements/achievements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    UserModule,
    MatchModule,
    AuthModule,
    TwoFactorModule,
    PongModule,
    SocketModule,
    CookieModule,
    StatusModule,
    FriendModule,
    AvatarModule,
    AchievementModule,
    PassportModule.register({ session: true }),
    ConfigModule.forRoot(configModuleOptions),
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
