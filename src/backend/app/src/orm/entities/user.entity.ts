import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Match } from './match.entity';

interface MatchTest {
  id: string,
};

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  intraId: string;

  @Column()
  username: string;

  @Column({ nullable: true})
  fullName: string;

  @Column({ nullable: true})
  email: string;

  @OneToMany(() => Match, match => match.winner)
  wins: Match[];

  @OneToMany(() => Match, match => match.loser)
  losses: Match[];

  // Two Factor
  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;
}

// creates a partial user where each field is optional
type Partial<T> = {
	[P in keyof T]?: T[P];
};
export type PartialUser = Partial<User>;
