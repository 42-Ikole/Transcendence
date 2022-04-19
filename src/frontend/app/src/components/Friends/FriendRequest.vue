<template>
  <div v-if="hasRequests">
    <p>You have no pending friend requests.</p>
  </div>
  <div v-for="user in friendRequests" :key="user.id">
    <p>
      Friend Request: {{ user.username }}
      <button class="btn btn-outline-light btn-sm" @click="accept(user)">
        Accept
      </button>
      <button class="btn btn-outline-light btn-sm" @click="reject(user)">
        Reject
      </button>
    </p>
  </div>

  <div v-for="user in sentRequests" :key="user.id">
    <p>
      {{ user.username }}
      <button class="btn btn-outline-light btn-sm" @click="cancelRequest(user)">
        Cancel
      </button>
    </p>
  </div>

  <hr class="divider" />

  <div v-if="!hasChatRequests">
    <p>You have no pending chat requests.</p>
  </div>
  <div v-for="chat in chatInvites" :key="chat.id">
    <p> Chat invite: {{ chat.name }}
      <button class="btn btn-outline-light btn-sm" @click="acceptChatInvite()">
        Accept
      </button>
      <button class="btn btn-outline-light btn-sm" @click="rejectChatInvite()">
        Reject
      </button>
    </p>
  </div>

  <div v-for="user in chatRequests" :key="user.id">
    <p>
      {{ user.name }}
      <button class="btn btn-outline-light btn-sm" @click="cancelChatRequest(user)">
        Cancel
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import type { PublicUser } from "@/types/UserType";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";
import { Chat } from "../chatrooms/Chatrooms.types.ts";

interface dataObject {
  chatInvites: Chat[],
  chatRequests: User[],
  adminChats: Chat[],
}

export default defineComponent({
  data() {
    return {
      chatInvites: [],
      chatRequests: [],
      adminChats: [],
    }
  },
  computed: {
    ...mapState(useFriendStore, ["sentRequests", "friendRequests"]),
    hasRequests(): boolean {
      return this.friendRequests.length === 0 && this.sentRequests.length === 0;
    },
    hasChatRequests() {
      console.log('chat invs: ', this.chatInvites);
      return this.chatInvites.length !== 0;
    },
  },
  methods: {
    cancelRequest(user: PublicUser) {
      makeApiCall(`/friend/request/cancel/${user.id}`, {
        method: "DELETE",
      });
    },
    accept(user: PublicUser) {
      this.makeCall(user, "accept");
    },
    reject(user: PublicUser) {
      this.makeCall(user, "reject");
    },
    makeCall(user: PublicUser, type: "reject" | "accept") {
      makeApiCallJson(`friend/request/${type}`, "POST", {
        id: user.id,
      });
    },
    async cancelChatRequest(user: User) {
      const cancelChatResponse = await makeApiCallJson("/chat/invite", "DELETE", {
        chatId: chat.id,
        userId: user.id,
      });
      if (cancelChatResponse.ok) {
        console.log('cancelen gelukt');
      }
    },
    async acceptChatInvite() {
      const acceptChatResponse = await makeApiCall("/chat/invite/accept");
      if (acceptChatResponse.ok) {
        console.log('acceptatie gelukt');
      }
    },
    async rejectChatInvite() {
      const acceptChatResponse = await makeApiCall("/chat/invite/decline");
      if (acceptChatResponse.ok) {
        console.log('afgewezen gelukt');
      }
    },
  },
  async mounted() {
    const chatInvitesResponse = await makeApiCall("/chat/user/invite");
    if (chatInvitesResponse.ok) {
      this.chatInvites = await chatInvitesResponse.json();
    }

    const chatAdminResponse = await makeApiCall("/user/chat/admin");
    if (chatAdminResponse.ok) {
      this.adminChats = await chatAdminResponse.json();
    }

    const chatRequestsResponse = await makeApiCall("/chat/invite/" + this.chat.id);
    if (chatRequestsResponse.ok) {
      this.chatRequests = await chatRequestsResponse.json();
    }
  },
});
</script>
