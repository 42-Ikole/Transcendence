import { User } from "src/orm/entities/user.entity";

// When requesting information about other users
export class PublicUser {
	id: number;
	username: string;
	constructor(user: User) {
		this.id = user.id;
		this.username = user.username;
	}
}

// For your own profile
export class PrivateUser extends PublicUser{
	twoFactorEnabled: boolean;
	constructor(user: User) {
		super(user);
		this.twoFactorEnabled = user.twoFactorEnabled;
	}
}
