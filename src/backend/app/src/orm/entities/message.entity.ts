import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';
import { DirectMessage } from './directmessage.entity';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id)
  author: User;

  @ManyToOne(() => Chat, (chat) => chat.messages, {
		onDelete: "CASCADE",
	})
  chatRoom: Chat;

  @ManyToOne(() => DirectMessage, (dm) => dm.messages, {
    onDelete: 'CASCADE'
  })
  directMessage: DirectMessage;

  @Column()
  message: string;

  @CreateDateColumn()
  dateCreated: Date;
}
