import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeORMSession } from './entities/session.entity';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'pong_db',
  host: 'postgres',
  port: 5432,
  username: 'root',
  password: 'root',
  entities: [User, Match, TypeORMSession, Chat, Message],
  synchronize: true,
};
