import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Match } from './match.entity';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Exclude } from "class-transformer";

//////     //////
// User Entity //
//////     //////

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

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

  // Two Factor
  @Column({ nullable: true })
  @Exclude()
  twoFactorSecret: string;

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
  @IsOptional()
  twoFactorSecret?: string;

  @IsBoolean()
  @IsOptional()
  twoFactorEnabled?: boolean;
}
