import { PrimaryColumn, Column, Entity, CreateDateColumn, Timestamp } from 'typeorm'

@Entity()
export class Message {
    @PrimaryColumn()
    key: number;

    @Column()
    message: string;

    @Column()
    author: number;

    @Column({type: 'timestamp'})
    dateCreated: Date;

}
