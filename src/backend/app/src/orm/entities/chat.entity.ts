import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Exclude } from 'class-transformer';
import { Ban } from './ban.entity';
import { Mute } from './mute.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToOne(() => User, (user) => user.ownedChats)
  owner: User;

  @ManyToMany(() => User, (user) => user.adminChats)
  @JoinTable()
  admins: User[];

  @Column({ default: null })
  @Exclude()
  password: string;

  @OneToMany(() => Message, (msg) => msg.chatRoom, {
    cascade: true,
  })
  messages: Message[];

  @ManyToMany(() => User, (user) => user.chats)
  @JoinTable()
  members: User[];

  @Column()
	type: string;
	
	@ManyToMany(() => User, (user) => user.chatInvites)
	@JoinTable()
	invitedUsers: User[];

	@OneToMany(() => Ban, (ban: Ban) => ban.chat)
	bans: Ban[];

	@OneToMany(() => Mute, (mute: Mute) => mute.chat)
	mutes: Mute[];
}
