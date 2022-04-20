<template>
  <div class="input-group">
    <button
      class="btn dropdown mb-2"
      type="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      :class="onlineOutline"
    >
      {{ user.username }}
    </button>
    <ul class="dropdown-menu">
      <li>
        <h6 class="dropdown-header">{{ status }}</h6>
      </li>
      <li>
        <hr class="dropdown-divider" />
      </li>
      <li>
        <button @click="viewProfile" class="dropdown-item" type="button">
          View Profile
        </button>
      </li>
      <div v-if="!isSelf">
        <li v-if="canMessage">
          <button
            @click="startDirectMessage"
            class="dropdown-item"
            type="button"
          >
            Message
          </button>
        </li>
        <li v-if="isOnline">
          <button @click="sendChallenge" class="dropdown-item" type="button">
            Send Challenge
          </button>
        </li>
        <li v-if="canObserve">
          <button @click="observeUser" class="dropdown-item" type="button">
            Observe Game
          </button>
        </li>
        <li>
          <hr class="dropdown-divider" />
        </li>
        <li v-if="isFriend">
          <button @click="unfriendUser" class="dropdown-item" type="button">
            Unfriend
          </button>
        </li>
        <li v-if="!isBlocked">
          <button @click="blockUser" class="dropdown-item" type="button">
            Block
          </button>
        </li>
        <li v-if="isBlocked">
          <button @click="unblockUser" class="dropdown-item" type="button">
            Unblock
          </button>
        </li>
        <li v-if="hasNoRelation">
          <button
            @click="sendFriendRequestUser"
            class="dropdown-item"
            type="button"
          >
            Send Friend Request
          </button>
        </li>
        <li v-if="isFriend">
          <button @click="unfriendUser" class="dropdown-item" type="button">
            Unfriend
          </button>
        </li>
        <div v-if="showChatOptions">
          <li v-if="canBanKickMute">
            <hr class="dropdown-divider" />
            <div v-if="!isMuted">
              <button @click="muteUser" class="dropdown-item" type="button">
                Mute
              </button>
            </div>
            <div v-if="isMuted">
              <button @click="unmuteUser" class="dropdown-item" type="button">
                Unmute
              </button>
            </div>
            <button @click="kickUser" class="dropdown-item" type="button">
              Kick
            </button>
          </li>
          <li v-if="canBanKickMute">
            <button @click="banUser" class="dropdown-item" type="button">
              Ban
            </button>
          </li>
          <li v-if="canMakeAdmin">
            <button @click="makeAdmin" class="dropdown-item" type="button">
              Make Admin
            </button>
          </li>
          <li v-if="canRemoveAdmin">
            <button @click="removeAdmin" class="dropdown-item" type="button">
              Remove Admin
            </button>
          </li>
        </div>
      </div>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { PublicUser } from "@/types/UserType";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import { useChatStore } from "@/stores/ChatStore";
import { challengeUser } from "@/utils/Pong";
import { sendFriendRequest, unfriend, unblock, block } from "@/utils/Friends";
import { stopTrackingUserStatus, trackUserStatus } from "@/utils/StatusTracker";
import type { StatusUpdate } from "@/types/StatusTypes";
import { useSocketStore } from "@/stores/SocketStore";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";

type RoleType = "OWNER" | "ADMIN" | "MEMBER";

interface DataObject {
  status: string;
  role: RoleType;
}

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<PublicUser>,
      required: true,
    },
    showChatOptions: {
      type: Boolean,
      required: true,
    },
    chatId: {
      type: Number,
      required: false,
    },
    mutedUsers: {
      type: Array as PropType<Array<PublicUser>>,
      required: false,
    },
  },
  data(): DataObject {
    return {
      status: "",
      role: "MEMBER",
    };
  },
  computed: {
    canMessage() {
      return (
        !this.isBlocked &&
        !useFriendStore().isPartOfSet(this.user.id, "BLOCKED_BY")
      );
    },
    isBlocked() {
      return useFriendStore().isPartOfSet(this.user.id, "BLOCKED");
    },
    hasNoRelation() {
      return useFriendStore().hasNoRelation(this.user.id);
    },
    isFriend() {
      return useFriendStore().isPartOfSet(this.user.id, "FRIENDS");
    },
    isSelf() {
      return useUserStore().profileData!.id === this.user.id;
    },
    isOnline() {
      return this.status === "ONLINE";
    },
    onlineOutline() {
      return this.status === "ONLINE"
        ? "btn-outline-success"
        : "btn-outline-danger";
    },
    isOffline() {
      return this.status === "OFFLINE";
    },
    canObserve() {
      return ["PLAYING", "OBSERVING"].includes(this.status);
    },
    isAdmin() {
      return useChatStore().isAdmin(this.chatId) || this.isOwner;
    },
    isOwner() {
      return useChatStore().isOwner(this.chatId);
    },
    canMakeAdmin() {
      return this.isOwner && this.role !== "ADMIN";
    },
    canRemoveAdmin() {
      return this.isOwner && this.role === "ADMIN";
    },
    isMuted() {
      if (!this.mutedUsers) {
        return false;
      }
      return !!this.mutedUsers.find((muted) => this.user.id === muted.id);
    },
    canBanKickMute() {
      return (
        this.role !== "OWNER" &&
        (this.isOwner || (this.isAdmin && this.role !== "ADMIN"))
      );
    },
  },
  methods: {
    viewProfile() {
      this.$router.push(`/profile/${this.user.id}`);
    },
    sendChallenge() {
      challengeUser(this.user.id, false);
    },
    blockUser() {
      block(this.user);
    },
    unblockUser() {
      unblock(this.user);
    },
    sendFriendRequestUser() {
      sendFriendRequest(this.user);
    },
    unfriendUser() {
      unfriend(this.user);
    },
    trackState(update: StatusUpdate) {
      this.status = update.newState;
    },
    async startDirectMessage() {
      const response = await makeApiCallJson("/chat/directMessage", "POST", {
        id: this.user.id,
      });
      if (response.ok) {
        const dm = await response.json();
        console.log(dm);
        this.$router.push(`/dm/${dm.id}`);
      }
      return;
    },
    async muteUser() {
      await makeApiCallJson("/chat/mute", "POST", {
        chatId: this.chatId,
        userId: this.user.id,
      });
    },
    async unmuteUser() {
      await makeApiCallJson("/chat/mute", "DELETE", {
        chatId: this.chatId,
        userId: this.user.id,
      });
    },
    async kickUser() {
      await makeApiCallJson("/chat/kick", "DELETE", {
        chatId: this.chatId,
        userId: this.user.id,
      });
    },
    async banUser() {
      await makeApiCallJson("/chat/ban", "POST", {
        chatId: this.chatId,
        userId: this.user.id,
      });
    },
    async makeAdmin() {
      if (this.role === "MEMBER") {
        await makeApiCallJson("/chat/admin", "POST", {
          chatId: this.chatId,
          userId: this.user.id,
        });
      }
    },
    async removeAdmin() {
      if (this.role === "ADMIN") {
        await makeApiCallJson("/chat/admin", "DELETE", {
          chatId: this.chatId,
          userId: this.user.id,
        });
      }
    },
    async refreshRole() {
      const roleResponse = await makeApiCall(
        "/chat/role/" + this.chatId + "/" + this.user.id
      );
      if (roleResponse.ok) {
        this.role = (await roleResponse.text()) as RoleType;
      }
    },
    observeUser() {
      useSocketStore().pong!.emit("requestObserve", { userId: this.user.id });
    },
  },
  mounted() {
    this.status = this.user.status;
    trackUserStatus(this.user.id, this.trackState);
    if (this.showChatOptions) {
      this.refreshRole();
      useSocketStore().chat!.on(`roleUpdate_${this.user.id}`, this.refreshRole);
    }
  },
  unmounted() {
    stopTrackingUserStatus(this.user.id, this.trackState);
    if (this.showChatOptions) {
      useSocketStore().chat!.removeListener(
        `roleUpdate_${this.user.id}`,
        this.refreshRole
      );
    }
  },
});
</script>
