import { Controller, Get, UseGuards, Req, Delete, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { NumberIdParam } from 'src/types/param.validation';
import { UserService } from 'src/user/user.service';
import { FriendService } from './friend.service';

@ApiTags('friend')
@Controller('friend')
@UseGuards(AuthenticatedGuard)
export class FriendController {

	constructor(
		private friendService: FriendService,
		private userService: UserService,
	) {}

	/*
	1. Store friend request in DB (if not blocked or not already friends)
	2. Emit friend request event to target (if online)
	*/
	@Post('request')
	requestFriend(@Req() req: RequestWithUser, @Body() param: NumberIdParam) {
		console.log(req.user.id, "friend requests:", param.id);
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
	async findRelations() {
		return await this.friendService.findAll();
	}

	@Post()
	async addFriend(@Req() request: RequestWithUser, @Body() param: NumberIdParam) {
		const target = await this.userService.findById(param.id);
		await this.friendService.newRelationShip(request.user, target);
	}
}
