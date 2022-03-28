import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserSerializer } from './auth.serializer';
import { IntraStrategy } from './oauth/intra.guard';
import { ConfigModule } from '@nestjs/config';
import { GithubStrategy } from './oauth/github.guard';
import { DiscordStrategy } from './oauth/discord.guard';

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [UserSerializer, AuthService, IntraStrategy, GithubStrategy, DiscordStrategy],
})
export class AuthModule {}
