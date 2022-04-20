import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Match } from './match.entity';
import { IsString, IsOptional, Equals } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Friend } from './friend.entity';
import { Chat } from './chat.entity';
import { Avatar } from './avatar.entity';
import { Ban } from './ban.entity';
import { Mute } from './mute.entity';
import { Achievement } from './achievement.entity';
import { DirectMessage } from './directmessage.entity';

//////     //////
// User Entity //
//////     //////

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Exclude()
  @Column()
  intraId: string;

  @Column({ unique: true, nullable: true })
  username: string;

  @OneToOne(() => Avatar, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avatarId' })
  avatar?: Avatar;

  @Column({ nullable: true })
  avatarId?: number;

  @OneToMany(() => Match, (match) => match.winner)
  wins: Match[];

  @OneToMany(() => Match, (match) => match.loser)
  losses: Match[];

  // Friendships
  @OneToMany(() => Friend, (relation: Friend) => relation.relatingUser)
  relatingUsers: Friend[];

  @OneToMany(() => Friend, (relation: Friend) => relation.relatedUser)
  relatedUsers: Friend[];

  @Column({ default: 'OFFLINE' })
  status: string;

  // Chats
  @ManyToMany(() => Chat, (chat) => chat.members)
  chats: Chat[];

  @OneToMany(() => Chat, (chat) => chat.owner)
  ownedChats: Chat[]; // chats where user is an owner

  @ManyToMany(() => Chat, (chat) => chat.admins)
  adminChats: Chat[]; // chats where user is an admin

  @ManyToMany(() => Chat, (chat) => chat.invitedUsers)
  chatInvites: Chat[];

  @OneToMany(() => Ban, (ban: Ban) => ban.userId)
  bans: Ban[];

  @OneToMany(() => Mute, (mute: Mute) => mute.userId)
  mutes: Mute[];
  @OneToMany(() => DirectMessage, (dm) => dm.userOne)
  relatingDM: DirectMessage[];

  @OneToMany(() => DirectMessage, (dm) => dm.userTwo)
  relatedDM: DirectMessage[];

  // Two Factor
  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

  @Exclude()
  @Column({ default: false })
  twoFactorEnabled: boolean;

  // Achievements
  @ManyToMany(() => Achievement, (cheevo) => cheevo.users)
  @JoinTable()
  achievements: Achievement[];
}

//////      //////
// Partial User //
//////      //////

// can only have username and avatar, otherwise the update shouldn't occur from an endpoints
export class PartialUser {
  @IsString()
  @IsOptional()
  username?: string;

  @Equals(undefined)
  avatar?: Avatar;

  @Equals(undefined)
  intraId?: string;

  @Equals(undefined)
  status?: string;

  @Equals(undefined)
  twoFactorSecret?: string;

  @Equals(undefined)
  twoFactorEnabled?: boolean;
}
