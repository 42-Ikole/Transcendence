<template>
  <div class="container py-5" style="height: 550px">
    <div class="row d-flex justify-content-center">
      <div class="chatroomSidebar col-lg-3">
        <div class="card" style="height: 100%">
          <div
            class="card-header d-flex justify-content-between align-items-center p-3"
          >
            <h2 class="mb-0">Users in chat:</h2>
          </div>
          <div class="card-body" style="height: auto; overflow-y: scroll">
            <div class="flex-row justify-content-start">
              <div class="small" v-for="user in users" :key="user.username">
                <ChatUserDropdown :user="user" :show-chat-options="true" :chatId="chat.id" :muted-users="mutedUsers" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-9" style="background-color: #eee">
        <div class="card">
          <div
            class="card-header d-flex justify-content-between align-items-center p-3"
          >
            <h3 class="mb-0 cr-name">{{ this.chat.name }}</h3>
            <div class="btn-toolbar" role="toolbar">
              <div class="btn-group me-2" role="group" v-if="(isAdmin || isOwner) && isPrivateChat">
                <div class="dropdown">
                  <button class="btn btn-outline-success dropdown btn-lg" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >
                    Invite
                  </button>
                  <ul class="dropdown-menu">
                    <ChatInviteList :usersInChatArray="users" :chatId="chat.id"/>
                  </ul>
                </div>
              </div>
              <div class="btn-group me-2" role="group" v-if="isAdmin || isOwner">
                <div class="dropdown">
                  <button class="btn btn-outline-primary dropdown btn-lg" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false" >
                    Ban list
                  </button>
                  <ul class="dropdown-menu">
                    <ChatBanList :chatId="chat.id" :banned-users="bannedUsers" :muted-users="mutedUsers" />
                  </ul>
                </div>
              </div>
              <div class="btn-group me-2" role="group">
                <button
                  type="button"
                  class="btn btn-outline-secondary btn-lg"
                  data-mdb-ripple-color="dark"
                  @click="switchToRoomList"
                >
                  Back
                </button>
              </div>
              <div class="btn-group me-2" role="group">
                <button
                  type="button"
                  class="btn btn-outline-danger btn-lg"
                  data-mdb-ripple-color="dark"
                  style="line-height: 1"
                  @click="deleteRoom"
                  v-if="isOwner"
                >
                  Delete chat
                </button>
                <button
                  type="button"
                  class="btn btn-outline-danger btn-lg"
                  data-mdb-ripple-color="dark"
                  @click="leaveRoom"
                  v-else-if="!isOwner"
                >
                  Leave chat
                </button>
              </div>
            </div>
          </div>
          <div
            id="autoScrollBottom"
            class="card-body"
            style="height: 500px; overflow-y: scroll; padding-bottom: 25px"
          >
            <div class="flex-row justify-content-start">
              <div
                class="small"
                v-for="message in this.messages"
                :key="message.author"
              >
                <div v-if="!isBlocked(message.author)">
                  <p class="chat-author">{{ message.author.username }}:</p>
                  {{ message.message }}
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer d-flex justify-content-start p-3">
            <form class="input-group" @submit.prevent="sendMessage">
              <input
                class="form-control form-control-lg"
                type="text"
                placeholder="Type message"
                v-model="myMessage"
                ref="messageBox"
                :disabled="isMuted"
              />
              <input
                class="btn btn-lg btn-outline-info btn-rounded float-end"
                type="submit"
                value="Send"
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.chatroomSidebar {
  width: 20%;
  background-color: #ff8e00;
}

.cr-name {
  font-weight: bold;
  text-decoration: underline;
}

.chat-author {
  display: inline-block;
}
</style>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { PublicUser } from "../../types/UserType.ts";
import { useSocketStore } from "@/stores/SocketStore";
import { mapState } from "pinia";
import { Chat, SendChatMessage } from "./Chatrooms.types.ts";
import { makeApiCall } from "@/utils/ApiCall";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";
import { useChatStore} from "@/stores/ChatStore";
import ChatInviteList from "./ChatInviteList.vue";
import ChatBanList from "./ChatBanList.vue";
import { useFriendStore } from "@/stores/FriendStore";

interface DataObject {
  myMessage: string;
  users: PublicUser[];
  messageToChat: SendChatMessage;
  messages: any[];
  admins: any[];
  mutedUsers: PublicUser[];
  bannedUsers: PublicUser[];
}

export default defineComponent({
  props: {
    chat: {
      type: Object as PropType<Chat>,
      required: true,
    },
  },
  data(): DataObject {
    return {
      myMessage: "",
      users: [],
      messageToChat: {
        chatName: "",
        message: "",
      },
      messages: [],
      admins: [],
      mutedUsers: [],
      bannedUsers: [],
    };
  },
  methods: {
    sendMessage() {
      this.messageToChat.chatName = this.chat.name;
      this.messageToChat.message = this.myMessage;
      this.socket.emit("messageToChat", this.messageToChat);
      this.myMessage = "";
    },
    receivedMessage(message) {
      if (this.chat.name === message.chatName) {
        this.messages.push(message.message);

        const autoScroll = this.$el.querySelector("#autoScrollBottom");
        autoScroll.scrollTop = autoScroll.scrollHeight;
      }
    },
    userJoinsChat(joinData) {
      if (joinData.chatName === this.chat.name) {
        this.users.push(joinData.user);
      }
    },
    userLeavesChat(leaveData) {
      if (leaveData.chatName === this.chat.name) {
        this.users = this.users.filter((item) => item.id !== leaveData.user.id);
      }
    },
    switchToRoomList() {
      this.$emit("roomLeft");
    },
    leaveRoom() {
      this.socket.emit("leaveRoom", { roomName: this.chat.name });
    },
    async deleteRoom() {
      const removeChatResponse = await makeApiCall("/chat/" + this.chat.id, { method: "DELETE" });
      if (removeChatResponse.ok) {
        this.$emit("roomDeleted", this.chat.name);
        this.switchToRoomList();
      }
    },
    async refreshChat() {
      const messagesResponse = await makeApiCall(
        "/chat/messages/" + this.chat.name
      );
      if (messagesResponse.ok) {
        this.messages = await messagesResponse.json();
        this.$refs.messageBox.focus();
      }
      const usersResponse = await makeApiCall("/chat/users/" + this.chat.name);
      if (usersResponse.ok) {
        this.users = await usersResponse.json();
      }
      const adminResponse = await makeApiCall("chat/admins/" + this.chat.name);
      if (adminResponse.ok) {
        this.admins = await adminResponse.json();
      }
    },
    async refreshMuteBans() {
      const muteResponse = await makeApiCall(`/chat/mute/${this.chat.id}`);
      if (muteResponse.ok) {
        this.mutedUsers = await muteResponse.json();
      }
      const banResponse = await makeApiCall(`/chat/ban/${this.chat.id}`);
      if (banResponse.ok) {
        this.bannedUsers = await banResponse.json();
      }
    },
    isBlocked(user: PublicUser) {
      return useFriendStore().isPartOfSet(user.id, "BLOCKED");
    },
  },
  computed: {
    ...mapState(useSocketStore, {
      socket: "chat",
    }),
    hasAdminRights() {
      return this.isAdmin || this.isOwner;
    },
    isAdmin() {
      return useChatStore().isAdmin(this.chat.id);
    },
    isOwner() {
      return useChatStore().isOwner(this.chat.id);
    },
    isMuted() {
      return false; // checken of user muted is
    },
    isPrivateChat() {
      return this.chat.type === "private";
    },
  },
  async mounted() {
    if (this.hasAdminRights) {
      this.socket!.emit("subscribeBanMuteUpdate", { id: this.chat.id });
      await this.refreshMuteBans();
      this.socket!.on(`banMuteUpdate_${this.chat.id}`, this.refreshMuteBans);
    }

    this.socket!.emit("subscribeToChat", { roomName: this.chat.name });
    this.socket!.on("subscribeToChatSuccess", this.refreshChat);
    this.socket!.on("messageToClient", this.receivedMessage);
    this.socket!.on("userJoinedRoom", this.userJoinsChat);
    this.socket!.on("userLeftRoom", this.userLeavesChat);
    this.socket!.on("leaveRoomSuccess", this.switchToRoomList);
    this.socket!.on("subscribeToChatFailure", () => {
      console.log("failed");
    });
    this.socket!.on("roomDeleted", this.switchToRoomList);
    useChatStore().refresh();
  },
  unmounted() {
    if (this.hasAdminRights) {
      this.socket!.emit("unsubscribeBanMuteUpdate", { id: this.chat.id });
      this.socket!.removeListener(`banMuteUpdate_${this.chat.id}`, this.refreshMuteBans);
    }
    this.socket!.emit("unsubscribeToChat", { roomName: this.chat.name });
    this.socket!.removeListener("subscribeToChatSuccess", this.refreshChat);
    this.socket!.removeListener("messageToClient", this.receivedMessage);
    this.socket!.removeListener("userJoinedRoom", this.userJoinsChat);
    this.socket!.removeListener("userLeftRoom", this.userLeavesChat);
    this.socket!.removeListener("leaveRoomSuccess", this.switchToRoomList);
    this.socket!.removeListener("roomDeleted", this.switchToRoomList);
  },
  components: {
    ChatUserDropdown,
    ChatInviteList,
    ChatBanList,
  },
});
</script>
