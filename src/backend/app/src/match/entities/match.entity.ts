import { PrimaryColumn, Column, Entity, ManyToOne, JoinColumn} from 'typeorm'
import { User } from '../../users/entities/user.entity';

@Entity()
export class Match {
    @PrimaryColumn()
    id: number;

    @ManyToOne(() => User, user => user.matchesWon)
    winnerId: User

    @ManyToOne(() => User, user => user.matchesLost)
    loserId: User

    @Column()
    winnerScore: number;

    @Column()
    loserScore: number;

    @Column({nullable: true})
    startedAt: Date;


}
