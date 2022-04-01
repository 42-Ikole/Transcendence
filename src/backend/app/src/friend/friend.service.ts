import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Friend } from 'src/orm/entities/friend.entity';
import { StatusService } from 'src/status/status.service';
import { Repository } from 'typeorm';
import { FriendDto } from './friend.types';

@Injectable()
export class FriendService {
	constructor(
		@InjectRepository(Friend) private friendRepository: Repository<Friend>,
		private statusService: StatusService,
	) {}

	async friendRequest(request: FriendDto) {
		const entity = this.createEntity(request);
		const result = await this.friendRepository.save(entity);
		this.emitUpdate(request);
		return result;
	}

	async acceptFriendRequest(friend: FriendDto) {
		const result = await this.updateType(friend);
		this.emitUpdate(friend);
		return result;
	}

	// Remove exact friend (example: unblock a single side of the relationship)
	async removeFriend(friend: FriendDto) {
		const entity = await this.findExactOrFail(friend);
		const result = await this.friendRepository.remove(entity);
		this.emitUpdate(friend);
		return result;
	}

	// Remove either friend (example: FRIEND can be both the relating or related user)
	async removeEither(friend: FriendDto) {
		const entity = await this.findFriendshipOrFail(friend);
		const result = await this.friendRepository.remove(entity);
		this.emitUpdate(friend);
		return result;
	}

	async blockUser(user: FriendDto) {
		const entity = this.createEntity(user);
		const result = await this.friendRepository.save(entity);
		this.emitUpdate(user);
		return result;
	}

	async unblockUser(user: FriendDto) {
		return await this.removeFriend(user);
	}

	async findAll(): Promise<Friend[]> {
		return this.friendRepository.find({
			relations: ["relatingUser", "relatedUser"]
		});
	}

	// Doesn't matter which ID
	// Return the other user that is a friend
	async findFriends(id: number) {
		const relations = await this.friendRepository.find({
			where: [
				{ relatedUser: id, type: "FRIEND" },
				{ relatingUser: id, type: "FRIEND" }
			],
			relations: ["relatingUser", "relatedUser"],
		});
		const friends = relations.map((relation: any) => {
			// typed incorrectly because it fetches the User instead of being a number
			if (relation.relatedUser.id !== id) {
				return relation.relatedUser;
			} else {
				return relation.relatingUser;
			}
		})
		return friends;
	}


/* Getters */
	// Only relevant if relatedUser
	// Return the other user that sent a request
	async findRequests(id: number) {
		const relations = await this.friendRepository.find({
			where: [
				{ relatedUser: id, type: "REQUEST" }
			],
			relations: ["relatingUser"],
		});
		const users = relations.map((relation) => {
			return relation.relatingUser;
		})
		return users;
	}

	// Only relevant if relatedUser
	// Return the other user that was blocked
	async findBlocked(id: number) {
		const relations = await this.friendRepository.find({
			where: [{relatingUser: id, type: "BLOCK"}],
			relations: ["relatedUser"],
		});
		const users = relations.map((relation) => {
			return relation.relatedUser;
		})
		return users;
	}

	async clear() {
		const entities = await this.friendRepository.find();
		return await this.friendRepository.remove(entities);
	}

/* Private */
	private createEntity(dto: FriendDto) {
		return this.friendRepository.create(dto);
	}

	private async updateType(dto: FriendDto) {
		const entity = await this.friendRepository.findOne({
			relatingUser: dto.relatingUser,
			relatedUser: dto.relatedUser,
		});
		if (!entity) {
			throw new NotFoundException();
		}
		return await this.friendRepository.update(entity, dto);
	}

	private async findFriendship(friend: FriendDto) {
		const entity = await this.friendRepository.findOne({
			where: [{
				...friend,
			}, {
				relatingUser: friend.relatedUser,
				relatedUser: friend.relatingUser,
				type: friend.type,
			}]
		});
		return entity;
	}

	private findExact(friend: FriendDto) {
		return this.friendRepository.findOne(friend);
	}

	private async findExactOrFail(friend: FriendDto) {
		const entity = await this.findExact(friend);
		this.checkNotFound(entity);
		return entity;
	}

	private async findFriendshipOrFail(friend: FriendDto) {
		const entity = await this.findFriendship(friend);
		this.checkNotFound(entity);
		return entity;
	}

	private checkNotFound(entity: Friend | undefined) {
		if (!entity) {
			return new NotFoundException();
		}
	}

	private emitUpdate(users: FriendDto) {
		this.statusService.emitToUser(users.relatingUser, "friendUpdate");
		this.statusService.emitToUser(users.relatedUser, "friendUpdate");
	}
}
