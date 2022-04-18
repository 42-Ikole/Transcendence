import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';
import { Chat } from './chat.entity';

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

  @Column()
  message: string;

  @CreateDateColumn()
  dateCreated: Date;
}
