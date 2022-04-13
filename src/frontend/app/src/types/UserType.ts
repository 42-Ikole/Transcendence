// When requesting information about other users
export interface PublicUser {
  id: number;
  username: string;
  status: string;
}

// For your own profile
export interface UserProfileData extends PublicUser {
  twoFactorEnabled: boolean;
}
