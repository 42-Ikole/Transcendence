import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from 'src/match/entities/match.entity';

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

  @Column({array: true, default: {}})
  matchHistory: Match[]
}
