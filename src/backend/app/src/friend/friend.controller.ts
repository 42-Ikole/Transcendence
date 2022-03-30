import { Controller, Get, UseGuards, Req, Delete, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { IdDto, NumberIdParam } from 'src/types/param.validation';
import { UserService } from 'src/user/user.service';
import { FriendService } from './friend.service';
import { UserRelationDto } from './friend.types';

@ApiTags('relation')
@Controller('relation')
@UseGuards(AuthenticatedGuard)
export class FriendController {

	constructor(
		private friendService: FriendService,
	) {}

	/*
	1. Store friend request in DB (if not blocked or not already friends)
	2. Emit friend request event to target (if online)
	*/
	@Post('request')
	async requestFriend(@Req() req: RequestWithUser, @Body() param: IdDto) {
		console.log(req.user.id, "friend requests:", param.id);
		const dto: UserRelationDto = {
			relatingUserId: req.user.id,
			relatedUserId: param.id,
			type: "REQUEST",
		};
		await this.friendService.newRelationShip(dto);
	}

	/*
	1. Remove friend request from DB
	2. Emit rejection to original user
	*/
	@Post('request/reject')
	rejectFriend() {}

	/*
	1. Remove entry from DB if type === FRIEND
	2. Emit friendUpdate to both users
	*/
	@Delete('unfriend')
	unfriend() {}

	/*
	1. Set block relation in DB
		- Replace current FRIEND relation if present (potentially swap IDs)
	2. Emit to user who made the request that the block was successful
	*/
	@Post('block')
	blockUser() {}

	@Get()
	async findAllRelations() {
		return await this.friendService.findAll();
	}

	@Get('friends')
	async findRelations(@Req() request: RequestWithUser) {
		return await this.friendService.findFriends(request.user.id);
	}
	
	@Get('blocked')
	async findBlocks(@Req() request: RequestWithUser) {
		return await this.friendService.findBlocked(request.user.id);
	}
	
	@Get('requests')
	async findRequests(@Req() request: RequestWithUser) {
		return await this.friendService.findRequests(request.user.id);
	}
}
