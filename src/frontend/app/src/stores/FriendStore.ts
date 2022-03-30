import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineStore } from "pinia";

interface FriendState {
  friends: PublicUser[];
  friendRequests: PublicUser[];
  blockedUsers: PublicUser[];
}

export const useFriendStore = defineStore("friend", {
  state: (): FriendState => {
      return {
        friends: [],
        friendRequests: [], // received requests
        blockedUsers: [],
    };
  },
  getters: {
  },
  actions: {
    async refresh() {
      await this.refreshFriends();
      await this.refreshFriendRequests();
      await this.refreshBlockedUsers();
    },
    async refreshFriends() {
      const response = await makeApiCall("/relation/friends");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.friends = await response.json();
    },
    async refreshFriendRequests() {
      const response = await makeApiCall("/relation/requests");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.friendRequests = await response.json();
    },
    async refreshBlockedUsers() {
      const response = await makeApiCall("/relation/blocked");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.blockedUsers = await response.json();
    },
  },
});
