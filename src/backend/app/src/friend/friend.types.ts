import { IsIn, IsInt, IsString } from "class-validator";

export type FriendRelationType = "FRIEND" | "REQUEST" | "BLOCK";
const FRIEND_RELATION_TYPES: FriendRelationType[] = ["FRIEND", "REQUEST", "BLOCK"];

export class FriendDto {
	constructor(relating: number, related: number, type: FriendRelationType) {
		this.relatingUser = relating;
		this.relatedUser = related;
		this.type = type;
	}

	@IsInt()
	relatingUser: number;
	@IsInt()
	relatedUser: number;
	@IsIn(FRIEND_RELATION_TYPES)
	type: FriendRelationType;
}
