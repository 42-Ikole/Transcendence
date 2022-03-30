import { IsNumberString } from 'class-validator';

export class NumberIdParam {
  @IsNumberString()
  id: number;
}
