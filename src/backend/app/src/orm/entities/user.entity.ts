import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Match } from './match.entity';
import { IsString, IsOptional, IsBoolean, IsIn } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Friend } from './friend.entity';
import { USER_STATES } from 'src/status/status.types';

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

  @Column()
  username: string;

  @Column({ nullable: true })
  avatar: string;

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

  // Two Factor
  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

  @Exclude()
  @Column({ default: false })
  twoFactorEnabled: boolean;
}

//////      //////
// Partial User //
//////      //////

export class PartialUser {
  @IsString()
  @IsOptional()
  username?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsString()
  @IsIn(USER_STATES)
  @IsOptional()
  status?: string;

  @IsString()
  @IsOptional()
  twoFactorSecret?: string;

  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}
