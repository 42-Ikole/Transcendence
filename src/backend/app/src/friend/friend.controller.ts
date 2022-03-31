import { Controller, Get, UseGuards, Req, Delete, Post, Body, BadRequestException, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { StatusService } from 'src/status/status.service';
import { IdDto, NumberIdParam } from 'src/types/param.validation';
import { UserService } from 'src/user/user.service';
import { FriendService } from './friend.service';
import { FriendRelationDto } from './friend.types';

@ApiTags('relation')
@Controller('relation')
@UseGuards(AuthenticatedGuard)
export class FriendController {

	constructor(
		private friendService: FriendService,
		private statusService: StatusService,
	) {}

	/*
	1. Store friend request in DB (if not blocked or not already friends)
	2. Emit friend request event to target (if online)
	*/
	@Post('friend-request')
	async requestFriend(@Req() req: RequestWithUser, @Body() param: IdDto) {
		console.log(req.user.id, "friend requests:", param.id);
		const dto: FriendRelationDto = {
			relatingUserId: req.user.id,
			relatedUserId: param.id,
			type: "REQUEST",
		};
		await this.friendService.newRelationShip(dto);
		this.statusService.emitToUser(param.id, "friendUpdate");
	}

	/*
	1. Remove friend request from DB
	2. Emit rejection to original user
	*/
	@Post('request/reject')
	async rejectFriend(@Req() req: RequestWithUser, @Body() param: IdDto) {
		await this.friendService.rejectRequest(req.user.id, param.id);
	}

	@Post('request/accept')
	async acceptFriend(@Req() req: RequestWithUser, @Body() param: IdDto) {
		await this.friendService.acceptRequest(req.user.id, param.id);
	}

	/*
	1. Remove entry from DB if type === FRIEND
	2. Emit friendUpdate to both users
	*/
	@Delete('unfriend/:id')
	async unfriend(@Req() req: RequestWithUser, @Param() params: NumberIdParam) {
		await this.friendService.removeFriend(req.user.id, params.id);
	}

	/*
	1. Set block relation in DB
		- Replace current FRIEND or REQUEST relation if present (potentially swap IDs)
	2. Emit to user who made the request that the block was successful
	*/
	@Post('block')
	async blockUser(@Req() req: RequestWithUser, @Body() param: IdDto) {
		await this.friendService.removeFriend(req.user.id, param.id);
		await this.friendService.blockUser(req.user.id, param.id);
	}

	@Delete('unblock/:id')
	async unblockUser(@Req() req: RequestWithUser, @Param() param: NumberIdParam) {
		await this.friendService.unblockUser(req.user.id, param.id);
	}

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
