import { PrimaryColumn, Column, Entity, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Message {
    @PrimaryColumn()
    id: number;
	
	@Column()
	@ManyToOne(() => User, user => user.id)
    author: User;

    @Column()
    message: string;

    @Column({type: 'timestamp'})
    dateCreated: Date;
}