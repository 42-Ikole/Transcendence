import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRelation } from 'src/orm/entities/friend.entity';
import { User } from 'src/orm/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { UserRelationDto, UserRelationType } from './friend.types';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(UserRelation) private friendRepository: Repository<UserRelation>,
		private userService: UserService,
	) {}

	createEntity(dto: UserRelationDto) {
		return this.friendRepository.create(dto);
	}

	async newRelationShip(relationDto: UserRelationDto) {
		const target = await this.userService.findById(relationDto.relatedUserId);
		console.log(relationDto);
		if (relationDto.relatingUserId === relationDto.relatedUserId) {
			throw new BadRequestException("cannot friend yourself");
		} else if (!target) {
			throw new BadRequestException("target friend doesn't exist");
		}
		const entity = this.createEntity(relationDto);
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

	// Doesn't matter which ID
	// Return the other user that is a friend
	async findFriends(id: number) {
		const relations = await this.friendRepository.find({
			where: [
				{ relatedUserId: id, type: "FRIEND" },
				{ relatingUserId: id, type: "FRIEND" }
			],
			relations: ["relatingUserId", "relatedUserId"],
		});
		return relations.map((relation) => {
			return relation.relatedUserId !== id ? relation.relatedUserId : relation.relatingUserId;
		})
	}
	
	// Only relevant if relatedUser
	// Return the other user that sent a request
	async findRequests(id: number) {
		const relations = await this.friendRepository.find({
			where: [
				{ relatedUserId: id, type: "REQUEST" }
			],
			relations: ["relatingUserId", "relatedUserId"],
		});
		const users = relations.map((relation) => {
			return relation.relatingUserId;
		})
		return users;
	}

	// Only relevant if relatedUser
	// Return the other user that was blocked
	async findBlocked(id: number) {
		const relations = await this.friendRepository.find({
			where: [{relatingUserId: id, type: "BLOCK"}],
			relations: ["relatingUserId", "relatedUserId"],
		});
		const users = relations.map((relation) => {
			return relation.relatedUserId;
		})
		return users;
	}
}
