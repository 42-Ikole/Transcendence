import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { UserSerializer } from './auth.serializer';
import { IntraStrategy } from './intra.guard';
import { ConfigModule } from '@nestjs/config';
import { GithubStrategy } from './github.guard';

@Module({
  imports: [HttpModule, UserModule, ConfigModule],
  controllers: [AuthController],
  providers: [UserSerializer, AuthService, IntraStrategy, GithubStrategy],
})
export class AuthModule {}
