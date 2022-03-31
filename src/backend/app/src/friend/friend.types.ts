export type FriendRelationType = "FRIEND" | "REQUEST" | "BLOCK";

export interface FriendRelationDto {
	relatingUserId: number;
	relatedUserId: number;
	type: FriendRelationType;
}
