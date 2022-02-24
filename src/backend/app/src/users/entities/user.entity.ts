import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from '../../match/entities/match.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userName: string;

  @Column({default: true})
  status: boolean;

  @Column()
  email: string;
  
  @Column()
  name: string;

  @Column()
  description: string;

  @Column('int', {array: true, default: null})
  matchHistory: number[]
}
