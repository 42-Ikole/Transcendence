import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineStore } from "pinia";

// TODO: should be a set of users!
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
      const response = await makeApiCall("/friend/friends");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.friends = await response.json();
    },
    async refreshFriendRequests() {
      const response = await makeApiCall("/friend/requests");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.friendRequests = await response.json();
    },
    async refreshBlockedUsers() {
      const response = await makeApiCall("/friend/blocked");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.blockedUsers = await response.json();
    },
  },
});
