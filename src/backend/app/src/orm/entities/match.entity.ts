import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, user => user.id)
  winner: User;

  @Column()
  winnerScore: number;

  @ManyToOne(() => User, user => user.id)
  loser: User;

  @Column()
  loserScore: number;
}
