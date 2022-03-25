import { IsString, IsNotEmpty, IsDefined, IsOptional, IsIn } from "class-validator";

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
