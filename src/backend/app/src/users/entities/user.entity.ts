import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { Match } from '../../match/entities/match.entity';
import { Chat } from 'src/chat/entities/chat.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true, default: '', select: false})
  password: string;

  @Column({unique: true})
  name: string;

  @Column({unique: true, nullable: true})
  userName: string;

  @Column ({unique: true, nullable: false})
  codamId: string;

  @Column({default: true})
  status: boolean;

  @Column({nullable: true})
  email: string;
  
  @Column({default: null})
  imagePath: string;

  @Column({nullable: true})
  description: string;
  /*TO ADD
    MATCHES
    CHAT
  */



  // @OneToMany(() => Match, match => match.winnerId)
  // matchesWon: Match[]

  // @OneToMany(() => Match, match => match.loserId)
  // matchesLost: Match[]

  // @OneToMany(() => Chat, chat => chat.owner)
  // owner: Chat;

  // @OneToMany(() => Chat, chat => chat.admin)
  // admin: Chat;

  // @Column({default: 0})
  // nbWins: number;

  // @Column({default: 0})
  // nbLosses: number;
}
