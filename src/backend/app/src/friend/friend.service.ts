import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FriendRelation } from 'src/orm/entities/friend.entity';
import { User } from 'src/orm/entities/user.entity';
import { StatusService } from 'src/status/status.service';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { FriendRelationDto, FriendRelationType } from './friend.types';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(FriendRelation) private friendRepository: Repository<FriendRelation>,
		private userService: UserService,
		private statusService: StatusService,
	) {}

	createEntity(dto: FriendRelationDto) {
		return this.friendRepository.create(dto);
	}

	async newRelationShip(relationDto: FriendRelationDto) {
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

	async rejectRequest(relatedUserId: number, relatingUserId: number) {
		const entity = await this.friendRepository.findOne({
			where: { relatingUserId, relatedUserId, type: "REQUEST" },
		});
		console.log("Removing:", entity);
		await this.friendRepository.delete(entity);
	}

	async acceptRequest(relatedUserId: number, relatingUserId: number) {
		const entity = await this.friendRepository.findOne({
			where: { relatedUserId, relatingUserId, type: "REQUEST" }
		});
		console.log("Removing:", entity);
		this.statusService.emitToUser(entity.relatingUserId, "friendUpdate");
		this.statusService.emitToUser(entity.relatedUserId, "friendUpdate");
		this.friendRepository.update(entity, {
			type: "FRIEND",
		});
	}

	async removeFriend(idOne: number, idTwo: number) {
		const entity = await this.friendRepository.findOne({
			where: [
				{ relatedUserId: idOne, relatingUserId: idTwo, type: "FRIEND" },
				{ relatedUserId: idTwo, relatingUserId: idOne, type: "FRIEND" },
				{ relatedUserId: idOne, relatingUserId: idTwo, type: "REQUEST" },
				{ relatedUserId: idTwo, relatingUserId: idOne, type: "REQUEST" },
			],
		});
		if (!entity) {
			return;
		}
		this.statusService.emitToUser(entity.relatingUserId, "friendUpdate");
		this.statusService.emitToUser(entity.relatedUserId, "friendUpdate");
		await this.friendRepository.delete(entity);
	}

	async blockUser(id: number, targetId: number) {
		const entity = this.createEntity({
			relatingUserId: id,
			relatedUserId: targetId,
			type: "BLOCK",
		});
		this.statusService.emitToUser(id, "friendUpdate");
		this.statusService.emitToUser(targetId, "friendUpdate");
		await this.friendRepository.save(entity);
	}
	
	async unblockUser(id: number, targetId: number) {
		const entity = await this.friendRepository.findOne({
			relatingUserId: id, relatedUserId: targetId, type: "BLOCK"
		});
		if (!entity) {
			return;
		}
		this.statusService.emitToUser(id, "friendUpdate");
		await this.friendRepository.delete(entity);
	}

	async findAll(): Promise<FriendRelation[]> {
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
		const friends = relations.map((relation: any) => {
			// typed incorrectly because it fetches the User instead of being a number
			if (relation.relatedUserId.id !== id) {
				return relation.relatedUserId;
			} else {
				return relation.relatingUserId;
			}
		})
		return friends;
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
