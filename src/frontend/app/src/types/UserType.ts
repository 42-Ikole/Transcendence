export type UserState =
  | "OFFLINE"
  | "ONLINE"
  | "CONNECTION_DENIED"
  | "SEARCHING"
  | "CHALLENGING"
  | "PLAYING"
  | "OBSERVING"
  | "CHALLENGED";
export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

// When requesting information about other users
export interface PublicUser {
  id: number;
  username: string;
  avatar: string;
  status: string;
}

// For your own profile
export interface UserProfileData extends PublicUser {
  twoFactorEnabled: boolean;
}
