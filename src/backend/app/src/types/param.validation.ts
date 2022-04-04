import { IsInt, IsNumberString } from 'class-validator';

export class IdDto {
  @IsInt()
  id: number;
}
