import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRelation } from 'src/orm/entities/friend.entity';
import { User } from 'src/orm/entities/user.entity';
import { Repository } from 'typeorm';
import { UserRelationDto } from './friend.types';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(UserRelation) private friendRepository: Repository<UserRelation>,
	) {}

	createEntity(dto: UserRelationDto) {
		return this.friendRepository.create(dto);
	}

	async newRelationShip(relating: User, related: User) {
		const entity = this.createEntity({
			relatingUserId: relating.id,
			relatedUserId: related.id,
			type: "FRIEND",
		});
		try {
			await this.friendRepository.save(entity);
		} catch(error) {
			throw new BadRequestException(error);
		}
	}

	async findAll(): Promise<UserRelation[]> {
		return this.friendRepository.find({
			relations: ["relatingUserId", "relatedUserId"]
		});
	}
}
