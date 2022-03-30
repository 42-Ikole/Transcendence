export type UserRelationType = "FRIEND" | "REQUEST" | "BLOCK";

export interface UserRelationDto {
	relatingUserId: number;
	relatedUserId: number;
	type: UserRelationType;
}
