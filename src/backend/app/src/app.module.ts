import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { ChatModule } from './chat/chat.module';
import { MessageModule } from './message/message.module';
import { MatchModule } from './match/match.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(), ChatModule, MatchModule, MessageModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
