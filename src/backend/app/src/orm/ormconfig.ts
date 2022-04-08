import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { TypeORMSession } from './entities/session.entity';
import { User } from './entities/user.entity';
import { Match } from './entities/match.entity';
import { Friend } from './entities/friend.entity';
import { Avatar } from './entities/avatar.entity';

export const config: PostgresConnectionOptions = {
  type: 'postgres',
  database: 'pong_db',
  host: 'postgres',
  port: 5432,
  username: 'root',
  password: 'root',
  entities: [User, Match, TypeORMSession, Friend, Avatar],
  synchronize: true,
};
