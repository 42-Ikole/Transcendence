import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { User } from '../users/entities/user.entity';
import { Match } from '../match/entities/match.entity';
import { Message } from '../message/entities/message.entity';
import { Chat } from '../chat/entities/chat.entity';
export const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'pong_db',
  host: 'postgres',
  port: 5432,
  username: 'root',
  password: 'root',
  entities: [User, Match, Chat, Message],
  synchronize: true,
};
