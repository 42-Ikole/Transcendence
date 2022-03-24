import { IsString, IsNotEmpty, IsDefined, IsOptional, IsIn } from "class-validator";

export class CreateChatDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsOptional()
	password: string;

	@IsString()
	@IsIn(["private", "protected", "public"])
	type: string;
}
