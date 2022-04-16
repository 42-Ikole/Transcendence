interface IAchievement {
	id: number;
	name: string;
	description: string;
}

export enum Achievements {
	SETUP_ACCOUNT = 1,
	PLAY_GAME,
	WIN_GAME,
	LOSE_GAME,
	WIN_TEN_GAMES,
	UPLOAD_AVATAR,
	BLOCK_USER,
	SEND_FRIEND_REQUEST,
	MAKE_FRIEND,
	UNFRIEND,
}

export const ACHIEVEMENTS: IAchievement[] = [
	{
		id: Achievements.SETUP_ACCOUNT,
		name: "All Set!",
		description: "Set up account information.",
	},
	{
		id: Achievements.PLAY_GAME,
		name: "Pong",
		description: "Play a game of Pong.",
	},
	{
		id: Achievements.WIN_GAME,
		name: "God",
		description: "Win a game of Pong.",
	},
	{
		id: Achievements.LOSE_GAME,
		name: "RIP",
		description: "Lose a game of Pong.",
	},
	{
		id: Achievements.WIN_TEN_GAMES,
		name: "This eval is lasting longer than expected...",
		description: "Win 10 games of Pong.",
	},
	{
		id: Achievements.UPLOAD_AVATAR,
		name: "Fancy",
		description: "Upload an avatar.",
	},
	{
		id: Achievements.BLOCK_USER,
		name: "Hater",
		description: "Block a user.",
	},
	{
		id: Achievements.SEND_FRIEND_REQUEST,
		name: "Notice me",
		description: "Send a friend request.",
	},
	{
		id: Achievements.MAKE_FRIEND,
		name: "F is for friends who do stuff together",
		description: "Make a friend.",
	},
	{
		id: Achievements.UNFRIEND,
		name: "U is for U and ME",
		description: "Unfriend someone.",
	},
];
