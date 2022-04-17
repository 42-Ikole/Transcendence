import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity()
export class DirectMessage {
	@PrimaryGeneratedColumn()
	id: number;

	@ManyToOne(() => User, (user) => user.relatingDM)
	userOne: User;

	@ManyToOne(() => User, (user) => user.relatedDM)
	userTwo: User;

	@OneToMany(() => Message, (message) => message.directMessage, {
		cascade: true,
	})
	messages: Message[];
}
