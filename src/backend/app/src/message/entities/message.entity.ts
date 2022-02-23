import { PrimaryColumn, Column, Timestamp } from 'typeorm'
import { Users } from 'src/users/interfaces/users.interface';

export class Message {
    @PrimaryColumn()
    key: number;

    @Column()
    message: string;

    @Column()
    Timestamp: Timestamp;

    @Column()
    author: Users

}
