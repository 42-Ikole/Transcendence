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

  @OneToMany(() => Match, (match: Match) => match.id)
  matches: Match[];

  // Two Factor
  @Column({ nullable: true })
  twoFactorSecret: string;

  @Column({ default: false })
  twoFactorEnabled: boolean;
}
