import {
  Controller,
  Get,
  UseGuards,
  Req,
  Delete,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Achievements } from 'src/achievements/achievements';
import { AchievementService } from 'src/achievements/achievements.service';
import { AuthenticatedGuard } from 'src/auth/auth.guard';
import { RequestWithUser } from 'src/auth/auth.types';
import { FriendService } from './friend.service';
import { FriendDto } from './friend.types';

@ApiTags('friend')
@Controller('friend')
@UseGuards(AuthenticatedGuard)
export class FriendController {
  constructor(
    private friendService: FriendService,
    private achievementService: AchievementService,
  ) {}

  /*
	1. Store friend request in DB (if not blocked or not already friends)
	2. Emit friend request event to target (if online)
	*/
  @Post('request')
  async friendRequest(
    @Req() request: RequestWithUser,
    @Body('id', ParseIntPipe) targetId: number,
  ) {
    const friendRequest = new FriendDto(request.user.id, targetId, 'REQUEST');
    const relation = await this.friendService.friendRequest(friendRequest);
    this.achievementService.addAchievement(
      request.user.id,
      Achievements.SEND_FRIEND_REQUEST,
    );
    return relation;
  }

  /*
	1. Remove friend request from DB
	2. Emit rejection to original user
	*/
  @Post('request/reject')
  async rejectFriend(
    @Req() request: RequestWithUser,
    @Body('id', ParseIntPipe) targetId: number,
  ) {
    console.log('Reject Friend:', request.user.id, '-', targetId);
    const reject = new FriendDto(targetId, request.user.id, 'REQUEST');
    return await this.friendService.removeFriend(reject);
  }

  @Post('request/accept')
  async acceptFriend(
    @Req() request: RequestWithUser,
    @Body('id', ParseIntPipe) targetId: number,
  ) {
    console.log('Accept Friend:', request.user.id, '-', targetId);
    const accept = new FriendDto(targetId, request.user.id, 'FRIEND');
    const relation = await this.friendService.acceptFriendRequest(accept);
    this.achievementService.addAchievement(
      request.user.id,
      Achievements.MAKE_FRIEND,
    );
    this.achievementService.addAchievement(targetId, Achievements.MAKE_FRIEND);
    return relation;
  }

  @Delete('request/cancel/:id')
  async cancelFriendRequest(
    @Req() request: RequestWithUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    console.log('Cancel Friend Request:', request.user.id, '-', targetId);
    const cancel = new FriendDto(request.user.id, targetId, 'REQUEST');
    return await this.friendService.cancelFriendRequest(cancel);
  }

  /*
	1. Remove entry from DB if type === FRIEND
	2. Emit friendUpdate to both users
	*/
  @Delete('unfriend/:id')
  async unfriend(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    console.log('Remove Friend:', req.user.id, '-', targetId);
    const unfriend = new FriendDto(targetId, req.user.id, 'FRIEND');
    const result = await this.friendService.removeEither(unfriend);
    this.achievementService.addAchievement(req.user.id, Achievements.UNFRIEND);
    return result;
  }

  /*
	1. Set block relation in DB
		- Replace current FRIEND or REQUEST relation if present (potentially swap IDs)
	2. Emit to user who made the request that the block was successful
	*/
  @Post('block')
  async blockUser(
    @Req() req: RequestWithUser,
    @Body('id', ParseIntPipe) targetId: number,
  ) {
    const block = new FriendDto(req.user.id, targetId, 'BLOCK');
    const relation = await this.friendService.blockUser(block);
    this.achievementService.addAchievement(
      req.user.id,
      Achievements.BLOCK_USER,
    );
    return relation;
  }

  @Delete('unblock/:id')
  async unblockUser(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) targetId: number,
  ) {
    const unblock = new FriendDto(req.user.id, targetId, 'BLOCK');
    return await this.friendService.unblockUser(unblock);
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

  @Get('requests/sent')
  async findSentRequests(@Req() request: RequestWithUser) {
    return await this.friendService.findSentRequests(request.user.id);
  }

  @Get('blocked-by')
  async getBlockedBy(@Req() request: RequestWithUser) {
    return await this.friendService.findBlockedBy(request.user.id);
  }

  @Delete('clear')
  async clearFriends() {
    return await this.friendService.clear();
  }
}
