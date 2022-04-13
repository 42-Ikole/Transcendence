import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, Unique } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';
import { Exclude } from 'class-transformer';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

	@Column({ unique: true })
	name: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

	@ManyToMany(() => User)
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
}
