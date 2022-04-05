import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineStore } from "pinia";
import { useSocketStore } from "./SocketStore";

// TODO: should be a set of users!
interface FriendState {
  friends: PublicUser[];
  friendRequests: PublicUser[];
  sentRequests: PublicUser[];
  blockedUsers: PublicUser[];
  blockedByUsers: PublicUser[];
}

type RelationType =
  | "FRIENDS"
  | "FRIEND_REQUESTS"
  | "SENT_REQUESTS"
  | "BLOCKED"
  | "BLOCKED_BY";

function appearsInList(id: number, users: PublicUser[]) {
  for (const user of users) {
    if (id === user.id) {
      return true;
    }
  }
  return false;
}

export const useFriendStore = defineStore("friend", {
  state: (): FriendState => {
    return {
      friends: [],
      friendRequests: [], // received requests
      sentRequests: [],
      blockedUsers: [],
      blockedByUsers: [],
    };
  },
  getters: {},
  actions: {
    isPartOfSet(id: number, relationType: RelationType): boolean {
      switch (relationType) {
        case "FRIENDS":
          return appearsInList(id, this.friends);
        case "FRIEND_REQUESTS":
          return appearsInList(id, this.friendRequests);
        case "SENT_REQUESTS":
          return appearsInList(id, this.sentRequests);
        case "BLOCKED":
          return appearsInList(id, this.blockedUsers);
        case "BLOCKED_BY":
          return appearsInList(id, this.blockedByUsers);
      }
    },
    init() {
      this.refresh();
      useSocketStore().status!.on("friendUpdate", this.refresh);
    },
    async refresh() {
      await this.refreshFriends();
      await this.refreshFriendRequests();
      await this.refreshSentRequests();
      await this.refreshBlockedUsers();
      await this.refreshBlockedByUsers();
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
    async refreshSentRequests() {
      const response = await makeApiCall("/friend/requests/sent");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.sentRequests = await response.json();
    },
    async refreshBlockedUsers() {
      const response = await makeApiCall("/friend/blocked");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.blockedUsers = await response.json();
    },
    async refreshBlockedByUsers() {
      const response = await makeApiCall("/friend/blocked-by");
      if (!response.ok) {
        console.error(response.statusText);
        return;
      }
      this.blockedByUsers = await response.json();
    },
  },
});
