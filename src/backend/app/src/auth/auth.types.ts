import { Request } from 'express';
import { User } from 'src/orm/entities/user.entity';
import { IsString, IsNotEmpty, IsDefined } from 'class-validator';

export interface UserWithTwoFactor extends User {
  twoFactorPassed: boolean;
}

export interface RequestWithUser extends Request {
  user: UserWithTwoFactor;
}

export interface SessionUser {
  id: number;
  twoFactorPassed: boolean;
}

export class TwoFactorCodeDto {
  @IsString()
  @IsNotEmpty()
  @IsDefined()
  twoFactorCode: string;
}

export type AuthenticatedState = 'AUTHENTICATED' | '2FA' | 'OAUTH';
