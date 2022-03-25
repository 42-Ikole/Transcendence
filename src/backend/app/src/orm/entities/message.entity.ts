import { PrimaryColumn, Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

@Entity()
export class Message {
  @PrimaryColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
	author: User;

	@ManyToOne(() => Chat, (chat) => chat.id)
	chatRoom: Chat;

  @Column()
  message: string;

  @Column({ type: 'timestamp' })
  dateCreated: Date;
}
