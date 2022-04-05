import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  winner: User;

  @Column()
  winnerScore: number;

  @ManyToOne(() => User, (user) => user.id, {
    eager: true,
  })
  loser: User;

  @Column()
  loserScore: number;

  @CreateDateColumn()
  createdDate: Date;
}
