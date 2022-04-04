import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

/*
Each relation has 2 users
ManyToOne: Relation -> User

relatingUser: the user who initiated the friendship/block
relatedUser: the user who received it
*/

@Entity()
export class Friend {
  @PrimaryColumn()
  @ManyToOne(() => User, (user: User) => user.relatingUsers, {
    onDelete: 'CASCADE',
  })
  relatingUser: number;

  @PrimaryColumn()
  @ManyToOne(() => User, (user: User) => user.relatedUsers, {
    onDelete: 'CASCADE',
  })
  relatedUser: number;

  @Column()
  type: string;
}
