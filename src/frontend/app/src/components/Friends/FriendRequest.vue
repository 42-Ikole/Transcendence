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

  <div v-for="chat in chatRequests" :key="chat.id">
    <div v-for="user in chat.invitedUsers" :key="user.id">
      <p>
        {{ user.username }} ({{ chat.name }})
        <button class="btn btn-outline-light btn-sm" @click="cancelChatRequest(chat.id, user.id)">
          Cancel
        </button>
        <div v-if="hasCanceled && selectedChatId === chat.id && selectedUserId === user.id" class="text-warning">
          You canceled the invitation for "{{ user.username }}" in chatroom "{{ chat.name }}"
        </div>
      </p>
    </div>
  </div>

</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
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
  chatRequests: User[];
  adminChats: Chat[];
  chatRequestStatus: ChatRequest;
  selectedChatId: Number;
  selectedUserId: Number;
}

export default defineComponent({
  data(): DataObject {
    return {
      chatInvites: [],
      chatRequests: [],
      adminChats: [],
      chatRequestStatus: ChatRequest.WAITING,
      selectedChatId: 0,
      selectedUserId: 0,
    }
  },
  computed: {
    ...mapState(useFriendStore, ["sentRequests", "friendRequests"]),
    hasRequests(): boolean {
      return this.friendRequests.length === 0 && this.sentRequests.length === 0;
    },
    hasChatRequests() {
      return this.chatInvites.length !== 0 || this.chatRequests.length !== 0;
    },
    hasAccepted() {
      return this.chatRequestStatus === ChatRequest.ACCEPTED;
    },
    hasDeclined() {
      return this.chatRequestStatus === ChatRequest.DECLINED;
    },
    hasCanceled() {
      return this.chatRequestStatus === ChatRequest.CANCELED;
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
    async cancelChatRequest(chatId: Number, userId: Number) {
      const cancelChatResponse = await makeApiCallJson("/chat/invite", "DELETE", {
        chatId: chatId,
        userId: userId,
      });
      if (cancelChatResponse.ok) {
        this.chatRequestStatus = ChatRequest.CANCELED;
        this.selectedChatId = chatId;
        this.selectedUserId = userId;
      }
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
  },
  async mounted() {
    const chatAdminResponse = await makeApiCall("/user/chat/admin");
    if (chatAdminResponse.ok) {
      this.adminChats = await chatAdminResponse.json();
    }

    const chatInvitesResponse = await makeApiCall("/chat/user/invite");
    if (chatInvitesResponse.ok) {
      this.chatInvites = await chatInvitesResponse.json();
    }

    const chatRequestsResponse = await makeApiCall("/chat/uninvite");
    if (chatRequestsResponse.ok) {
      this.chatRequests = await chatRequestsResponse.json();
    }
  },
});
</script>
