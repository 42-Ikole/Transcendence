import { Column, Entity, JoinColumn, JoinTable, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

/*
Each relation has 2 users
ManyToOne: Relation -> User

relatingUser: the user who initiated the friendship/block
relatedUser: the user who received it
*/

@Entity()
export class UserRelation {
	@PrimaryColumn()
	@ManyToOne(() => User, (user) => user.id, { cascade: true, primary: true })
	relatingUserId: number;

	@PrimaryColumn()
	@ManyToOne(() => User, (user) => user.id, { cascade: true, primary: true })
	relatedUserId: number;

	@Column()
	type: string;
}
