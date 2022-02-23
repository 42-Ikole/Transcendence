import { PrimaryColumn, Column } from 'typeorm'
import { Users } from 'src/users/interfaces/users.interface';

export class Match {
    @PrimaryColumn()
    id: number;

    @Column()
    winner: Users;

    @Column()
    loser: Users;

    @Column()
    winnerPoints: number;

    @Column()
    loserPoints: number;
}
