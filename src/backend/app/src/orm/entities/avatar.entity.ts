import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
 
@Entity()
export class Avatar {
  	@PrimaryGeneratedColumn()
	id: number;
 
	@Column()
	filename: string;
	
	@Column({type: 'bytea'})
	data: Uint8Array;
}


export interface avatarData {
	fileName:	string,
	raw:		Buffer
};
