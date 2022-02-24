import { PrimaryColumn, Column, Timestamp, Entity, OneToOne, OneToMany, ManyToOne } from 'typeorm';
import { Message } from 'src/message/entities/message.entity'
import { User } from '../../users/entities/user.entity';


@Entity()
export class Chat {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => User, user => user.owner)
    owner: User;

    @OneToOne(() => User, user => user.c)
    owner: number;

    @Column('int', {array: true})
    admin: number[];

    @Column('int', {array: true})
    member: number[];

    @Column('int', {array: true, default: {}})
    messages: number[];

    @Column({default: null})
    password: string;
}
