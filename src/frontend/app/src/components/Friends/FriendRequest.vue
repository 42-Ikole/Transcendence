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
      <button class="btn btn-outline-light btn-sm" @click="acceptChatInvite(chat.id)">
        Accept
      </button>
      <button class="btn btn-outline-light btn-sm" @click="declineChatInvite(chat.id)">
        Decline
      </button>
        <div v-if="hasAccepted && selectedChatId === chat.id" class="text-success">
          You successfully joined "{{ chat.name }}"!
        </div>
        <div v-if="hasDeclined && selectedChatId === chat.id" class="text-danger">
          You declined to join the chat "{{ chat.name }}".
        </div>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import { useSocketStore } from "@/stores/SocketStore";
import type { PublicUser } from "@/types/UserType";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";
import { Chat } from "../chatrooms/Chatrooms.types.ts";

enum ChatRequest {
  WAITING,
  ACCEPTED,
  DECLINED,
  CANCELED,
}

interface DataObject {
  chatInvites: Chat[];
  chatRequestStatus: ChatRequest;
  selectedChatId: Number;
  selectedUserId: Number;
}

export default defineComponent({
  data(): DataObject {
    return {
      chatInvites: [],
      chatRequestStatus: ChatRequest.WAITING,
      selectedChatId: 0,
      selectedUserId: 0,
    }
  },
  computed: {
    ...mapState(useFriendStore, ["sentRequests", "friendRequests"]),
    ...mapState(useSocketStore, ["chat"]),
    hasRequests(): boolean {
      return this.friendRequests.length === 0 && this.sentRequests.length === 0;
    },
    hasChatRequests() {
      return this.chatInvites.length !== 0;
    },
    hasAccepted() {
      return this.chatRequestStatus === ChatRequest.ACCEPTED;
    },
    hasDeclined() {
      return this.chatRequestStatus === ChatRequest.DECLINED;
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
    async acceptChatInvite(chatId: Number) {
      const acceptChatResponse = await makeApiCallJson("/chat/invite/accept", "POST", {
        chatId: chatId,
      });
      if (acceptChatResponse.ok) {
        this.chatRequestStatus = ChatRequest.ACCEPTED;
        this.selectedChatId = chatId;
      }
    },
    async declineChatInvite(chatId: Number) {
      const declineChatResponse = await makeApiCallJson("/chat/invite/decline", "POST", {
        chatId: chatId,
      });
      if (declineChatResponse.ok) {
        this.chatRequestStatus = ChatRequest.DECLINED;
        this.selectedChatId = chatId;
      }
    },
    async refreshChatData() {
      this.chatRequestStatus = ChatRequest.WAITING;
      const chatInvitesResponse = await makeApiCall("/chat/user/invite");
      if (chatInvitesResponse.ok) {
        this.chatInvites = await chatInvitesResponse.json();
      }
    }
  },
  async mounted() {
    await this.refreshChatData();
    this.chat!.on('chatInviteUpdate', this.refreshChatData);
  },
  unmounted() {
    this.chat!.removeListener('chatInviteUpdate', this.refreshChatData);
  },
});
</script>
