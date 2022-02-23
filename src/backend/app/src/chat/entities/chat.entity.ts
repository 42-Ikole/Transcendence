import { PrimaryColumn, Column, Timestamp } from 'typeorm';
import { Message } from 'src/message/entities/message.entity'
import { Users } from 'src/users/interfaces/users.interface';


export class Chat {
    @PrimaryColumn()
    key: number;

    @Column()
    owner: Users;

    @Column({array: true})
    admin: Users[];

    @Column({array: true})
    member: Users[];

    @Column({array: true, default: {}})
    messages: Message[];

    @Column({default: null})
    password: string;
}
