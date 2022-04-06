import { IsString, IsNotEmpty, IsOptional, IsIn } from "class-validator";

const CHATROOM_TYPES = ["private", "protected", "public"];

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	password: string;

	@IsString()
	@IsIn(CHATROOM_TYPES)
	type: string;
}

export class IncomingMessageDtO {
	@IsString()
	@IsNotEmpty()
	message: string;

	@IsString()
	@IsNotEmpty()
	chatName: string;
}

export class JoinRoomDto {
	@IsString()
	@IsNotEmpty()
	roomName: string;
}