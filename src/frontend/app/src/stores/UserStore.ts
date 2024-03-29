import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";
import type {
  AuthenticatedState,
  UserProfileData,
  UserState,
} from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { canMakeConnection } from "@/utils/Login";
import { useFriendStore } from "./FriendStore";
import { useChatStore } from "./ChatStore";

interface UserStore {
  state: UserState;
  authenticatedState: AuthenticatedState;
  profileData: UserProfileData | null;
  avatarUrl: string;
  updateCount: number;
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
      avatarUrl: "http://localhost:3000/user/avatar/0/0",
      updateCount: 0,
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
        status.on("updateAvatar", () => {
          this.updateCount += 1;
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
      useChatStore().init();
      this.setListeners();
    },
    async refreshUserData() {
      this.profileData = await initUserData();
      this.updateAvatar();
    },
    updateAvatar() {
      this.avatarUrl = `http://localhost:3000/user/avatar/${
        this.profileData!.id
      }/${this.updateCount}`;
    },
    logout() {
      this.setAuthState("OAUTH");
      this.setState("OFFLINE");
      this.profileData = null;
    },
  },
});

export function makeAvatarUrl(id: number) {
  return `http://localhost:3000/user/avatar/${id}/${
    useUserStore().updateCount
  }`;
}
