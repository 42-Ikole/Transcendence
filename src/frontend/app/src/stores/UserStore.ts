import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";
import type { UserProfileData } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { canMakeConnection } from "@/utils/Login";
import { useFriendStore } from "./FriendStore";

export type UserState =
  | "OFFLINE"
  | "ONLINE"
  | "CONNECTION_DENIED"
  | "SEARCHING"
  | "PLAYING"
  | "OBSERVING"
  | "CHALLENGED";

let updateCount = 0;

export type AuthenticatedState = "AUTHENTICATED" | "2FA" | "OAUTH";

interface UserStore {
  state: UserState;
  authenticatedState: AuthenticatedState;
  profileData: UserProfileData | null;
  avatarUrl: string;
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
      avatarUrl: "http://localhost:3000/user/avatar",
    };
  },
  getters: {
    isAuthenticated: (state) => {
      return state.authenticatedState === "AUTHENTICATED";
    },
  },
  actions: {
    setListeners() {
      const status = useSocketStore().status;
      if (status) {
        status.on('updateAvatar', () => {
          console.log("updating avatar!");
          updateCount += 1;
          this.updateAvatar();
        });
      }
    },
    setState(state: UserState) {
      console.log("New UserState:", state);
      this.state = state;
      if (this.profileData) {
        this.profileData.status = state;
      }
    },
    setAuthState(state: AuthenticatedState) {
      console.log("New Auth State:", state);
      this.authenticatedState = state;
    },
    setTwoFactor() {
      this.authenticatedState = "2FA";
    },
    async login() {
      this.authenticatedState = "AUTHENTICATED";
      const canConnect = await canMakeConnection();
      if (!canConnect) {
        this.setState("CONNECTION_DENIED");
        return;
      }
      this.setState("ONLINE");
      useSocketStore().init();
      await this.refreshUserData();
      useFriendStore().init();
      this.setListeners();
    },
    async refreshUserData() {
      this.profileData = await initUserData();
      this.updateAvatar();
    },
    updateAvatar() {
      this.avatarUrl = `http://localhost:3000/user/avatar/${this.profileData.id}/${updateCount}`;
    },
    logout() {
      this.setAuthState("OAUTH");
      this.setState("OFFLINE");
      this.profileData = null;
      useSocketStore().disconnectSockets();
    },
  },
});
