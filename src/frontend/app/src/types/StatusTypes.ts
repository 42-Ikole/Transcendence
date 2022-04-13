import type { UserState } from "./UserType";

export interface StatusUpdate {
  userId: number;
  newState: UserState;
}
