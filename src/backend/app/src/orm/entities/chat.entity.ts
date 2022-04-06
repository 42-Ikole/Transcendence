import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable, Unique } from 'typeorm';
import { User } from './user.entity';
import { Message } from './message.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

	@Column()
	name: string;

  @ManyToOne(() => User, (user) => user.id)
  owner: User;

	@ManyToMany(() => User)
	@JoinTable()
  admins: User[];

  @Column({ default: null })
  password: string;

  @OneToMany(() => Message, (msg) => msg.chatRoom, {
    cascade: true,
    eager: true,
  })
	messages: Message[];
	
	@ManyToMany(() => User)
	@JoinTable()
	members: User[];

  @Column()
  type: string;
}
