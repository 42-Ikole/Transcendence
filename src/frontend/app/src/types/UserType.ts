// for own user
export interface UserProfileData {
  id: number;
  intraId: string;
  username: string;
  avatar: string | null;
  fullName: string | null;
  email: string | null;
  twoFactorEnabled: boolean;
}

// for other users
export interface UserData {
	id: number;
	username: string;
	avatar: string | null;
}
