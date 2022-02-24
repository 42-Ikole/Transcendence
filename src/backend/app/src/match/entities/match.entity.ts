import { PrimaryColumn, Column, Entity} from 'typeorm'
import { User } from '../../users/entities/user.entity';

@Entity()
export class Match {
    @PrimaryColumn()
    key: number;

    @Column()
    winnerId: number;

    @Column()
    loserId: number;

    @Column()
    winnerPoints: number;

    @Column()
    loserPoints: number;
}
