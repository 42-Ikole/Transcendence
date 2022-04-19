import { Entity, PrimaryColumn, ManyToOne, Column } from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity()
export class Mute {
	@PrimaryColumn()
	@ManyToOne(() => User, (user: User) => user.mutes, {
		onDelete: "CASCADE",
	})
	userId: number;

	@PrimaryColumn()
	@ManyToOne(() => Chat, (chat: Chat) => chat.mutes, {
		onDelete: "CASCADE",
	})
	chatId: number;

	@Column({type: 'timestamp'})
	expirationDate: Date;
}
