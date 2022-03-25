import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
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

  @ManyToMany(() => User, (user) => user.id)
  admins: User[];

  @Column({ default: null })
  password: string;

  @OneToMany(() => Message, (msg) => msg.id, {
    cascade: true,
    eager: true,
  })
  messages: Message[];
}
