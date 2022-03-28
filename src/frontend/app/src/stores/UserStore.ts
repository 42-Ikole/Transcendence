import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";
import type { UserProfileData } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";

export type UserState =
  | "OFFLINE"
  | "ONLINE"
  | "SEARCHING"
  | "PLAYING"
  | "OBSERVING"
  | "CHALLENGED";
export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

interface UserStore {
  state: UserState;
  authenticatedState: AuthenticatedState;
  profileData: UserProfileData | null;
}

async function initUserData(): Promise<UserProfileData> {
  const response = await makeApiCall("/user");
  if (!response.ok) {
    throw new Error("could not fetch user data");
  }
  return await response.json();
}

export const useUserStore = defineStore("user", {
  state: (): UserStore => {
    return {
      state: "OFFLINE",
      authenticatedState: "OAUTH",
      profileData: null,
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticatedState === "AUTHENTICATED";
    },
  },
  actions: {
    setState(state: UserState) {
      console.log("New UserState:", state);
      this.state = state;
    },
    setAuthState(state: AuthenticatedState) {
      this.authenticatedState = state;
    },
    setTwoFactor() {
      this.authenticatedState = "2FA";
    },
    login() {
      this.authenticatedState = "AUTHENTICATED";
      this.state = "ONLINE";
      useSocketStore().initPongSocket();
    },
    async loadUserData() {
      this.profileData = await initUserData();
      console.log(this.profileData);
    },
    logout() {
      this.authenticatedState = "OAUTH";
      useSocketStore().disconnectSockets();
    },
  },
});
