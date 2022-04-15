<template>
  <div class="container py-5" v-if="isWaiting">
    <div
      class="card-header justify-content-between align-items-center p-3"
      style="width: 40%; background-color: #dee"
    >
      <form
        class="form-check"
        style="padding-bottom: 20x"
        v-for="allChats in chats"
        :key="allChats.chat"
        @submit.prevent="joinRoom"
      >
        <h3 v-if="allChats === chats.joinedChats">Your chatrooms:</h3>
        <h3 v-else>Other chatrooms:</h3>
        <div v-if="allChats.length === 0">
          <i class="text-muted fs-6">There are no chatrooms here.</i>
        </div>
        <div class="form-check" v-for="chat in allChats" :key="chat.name">
          <input
            class="form-check-input"
            type="radio"
            v-bind:value="chat.name"
            v-model="selectedChatName"
          />
          <label class="form-check-label" for="selectedChatName">
            {{ chat.name }}
          </label>
          <a v-if="chat.type === 'protected'">
            <ChatLockIcon />
          </a>
          <a v-else-if="chat.type === 'private'">
            <ChatPrivateIcon />
          </a>
          <div
            v-if="
              allChats === chats.otherChats &&
              selectedChatName === chat.name &&
              chat.type === 'protected'
            "
          >
            <input
              class="input_pass"
              placeholder="Password"
              :type="passwordVisibility"
              v-model="typedPassword"
            />
            <button class="button" type="button" @click="toggleShowPassword">
              <i v-if="showPassword">
                <EyeOpen />
              </i>
              <i v-else>
                <EyeClosed />
              </i>
            </button>
          </div>
        </div>
      </form>
      <div v-if="showDeleted" class="text-danger" style="padding-bottom: 5px">'{{ this.roomDeleted }}' is succesfully deleted!</div>
      <div v-if="correctPassword === false" class="text-danger" style="padding-bottom: 5px;">Invalid password!</div>
      <button class="btn btn-info btn-sm float-end" @click="createRoom">
        Create room
      </button>
      <button
        class="btn btn-success btn-sm"
        v-bind:disabled="selectedChatName === ''"
        @click="joinRoom"
      >
        Join room
      </button>
    </div>
  </div>
  <div v-if="isJoining">
    <Chatroom :chat="selectedChat" @roomLeft="setWaiting" @roomDeleted="isDeleted"/>
  </div>
  <div v-if="isCreating">
    <CreateRoom @roomCreated="setWaiting" />
  </div>
</template>

<script lang="ts">
import CreateRoom from "./CreateRoom.vue";
import Chatroom from "./ChatRoom.vue";
import { defineComponent } from "vue";
import { makeApiCall } from "@/utils/ApiCall";
import { Chat, AllChats } from "./Chatrooms.types.ts";
import { useSocketStore } from "@/stores/SocketStore";
import { mapState } from "pinia";
import ChatLockIcon from "../icons/IconChatLock.vue";
import ChatPrivateIcon from "../icons/IconChatPrivate.vue";
import EyeOpen from "../icons/IconEyeOpen.vue";
import EyeClosed from "../icons/IconEyeClosed.vue";

enum State {
  WAITING,
  CREATING,
  JOINING,
}

interface DataObject {
  state: State;
  chats: AllChats;
  selectedChat: Chat;
  selectedChatName: string;
  typedPassword: string;
  showPassword: boolean;
  correctPassword: boolean;
  showDeleted: boolean;
  roomDeleted: string;
}

export default defineComponent({
  data(): DataObject {
    return {
      state: State.WAITING,
      chats: [],
      selectedChat: [],
      selectedChatName: "",
      typedPassword: "",
      showPassword: false,
      correctPassword: true,
      showDeleted: false,
      roomDeleted: "",
    };
  },
  computed: {
    isWaiting() {
      return this.state === State.WAITING;
    },
    isCreating() {
      return this.state === State.CREATING;
    },
    isJoining() {
      return this.state === State.JOINING;
    },
    passwordVisibility() {
      return this.showPassword ? "text" : "password";
    },
    ...mapState(useSocketStore, {
      socket: "chat",
    }),
  },
  methods: {
    createRoom() {
      this.state = State.CREATING;
      this.showDeleted = false;
      this.roomDeleted = "";
    },
    async joinRoom() {
      this.socket.emit("joinRoom", {
        roomName: this.selectedChatName,
        password: this.typedPassword,
      });
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    setWaiting() {
      this.state = State.WAITING;
      this.selectedChatName = "";
      this.typedPassword = "";
      this.showPassword = false;
      this.correctPassword = true;
    },
    isDeleted(roomName: string) {
      this.showDeleted = true;
      this.roomDeleted = roomName;
      this.setWaiting();
    },
    async getAllChats() {
      const response = await makeApiCall("/chat");
      if (response.ok) {
        this.chats = await response.json();
      }
    },
    joinRoomSuccessfully() {
      this.selectedChat = this.findChatByName(this.selectedChatName);
      this.state = State.JOINING;
    },
    joinRoomFailed() {
      this.correctPassword = false;
    },
    findChatByName(name: string): Chat {
      for (let chat of this.chats.joinedChats) {
        if (chat.name === name) {
          return chat;
        }
      }
      for (let chat of this.chats.otherChats) {
        if (chat.name === name) {
          return chat;
        }
      }
    },
    async refreshChatList() {
      await this.getAllChats();
    },
  },
  async mounted() {
    await this.getAllChats();
    this.socket.on("joinRoomSuccess", this.joinRoomSuccessfully);
    this.socket.on("joinRoomFailure", this.joinRoomFailed);
    this.socket.on("roomCreated", this.refreshChatList);
    this.socket.on("roomDeleted", this.refreshChatList);
  },
  unmounted() {
    this.socket.removeListener("joinRoomSuccess", this.joinRoomSuccessfully);
    this.socket.removeListener("joinRoomFailure", this.joinRoomFailed);
    this.socket.removeListener("roomCreated", this.refreshChatList);
    this.socket.removeListener("roomDeleted", this.refreshChatList);
  },
  watch: {
    selectedChatName(newRoom, oldRoom) {
      if (oldRoom !== this.selectedChatName) {
        this.typedPassword = "";
        this.correctPassword = true;
        this.showDeleted = false;
        this.roomDeleted = "";
      }
    },
  },
  components: {
    CreateRoom,
    Chatroom,
    ChatLockIcon,
    ChatPrivateIcon,
    EyeOpen,
    EyeClosed,
  },
});
</script>
