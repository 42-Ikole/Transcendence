import { Column, Entity, PrimaryGeneratedColumn } from 	"typeorm";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	id: Number;

	@Column()
	name:  String;
}
