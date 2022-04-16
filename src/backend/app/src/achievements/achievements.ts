interface IAchievement {
	id: number;
	name: string;
	description: string;
}

export const ACHIEVEMENTS: IAchievement[] = [
	{
		id: 1,
		name: "All Set!",
		description: "Set up account information.",
	},
	{
		id: 2,
		name: "Pong",
		description: "Play a game of Pong.",
	},
	{
		id: 3,
		name: "God",
		description: "Win a game of Pong.",
	},
	{
		id: 4,
		name: "RIP",
		description: "Lose a game of Pong.",
	},
	{
		id: 5,
		name: "This eval is lasting longer than expected...",
		description: "Win 10 games of Pong.",
	},
	{
		id: 6,
		name: "Fancy",
		description: "Upload an avatar.",
	},
	{
		id: 7,
		name: "Hater",
		description: "Block a user.",
	},
	{
		id: 8,
		name: "Notice me",
		description: "Send a friend request.",
	},
	{
		id: 9,
		name: "F is for friends who do stuff together",
		description: "Make a friend.",
	},
	{
		id: 10,
		name: "U is for U and ME",
		description: "Unfriend someone.",
	},
];
