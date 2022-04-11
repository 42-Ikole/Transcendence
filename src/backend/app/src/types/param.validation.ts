import { IsInt } from 'class-validator';

export class IdDto {
  @IsInt()
  id: number;
}
