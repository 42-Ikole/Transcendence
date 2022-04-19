import { Column, Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Achievement {
  @PrimaryColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => User, (user) => user.achievements)
  users: User[];
}
