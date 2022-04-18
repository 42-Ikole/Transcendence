import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class Ban {
	@PrimaryColumn()
	@ManyToOne(() => User, (user: User) => user.bans)
	user: User;

	@PrimaryColumn()
	@ManyToOne(() => Chat, (chat: Chat) => chat.bans)
	chat: Chat;

	@Column({type: 'timestamp'})
	expirationDate: Date;
}
