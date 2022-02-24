import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Match } from '../../match/entities/match.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({unique: true, nullable: true})
  userName: string;

  @Column({default: true})
  status: boolean;

  @Column()
  email: string;
  
  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => Match, match => match.winnerId)
  matchesWon: Match[]

  @OneToMany(() => Match, match => match.loserId)
  matchesLost: Match[]

  @OneToMany(() => Chat, chat => chat.owner)
  owner: Chat;

  @OneToMany(() => Chat, chat => chat.admin)
  admin: Chat;

  @Column({default: 0})
  nbWins: number;

  @Column({default: 0})
  nbLosses: number;
}
