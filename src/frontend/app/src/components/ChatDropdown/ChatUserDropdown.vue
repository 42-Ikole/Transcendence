<template>
  <div class="input-group">
    <button
      class="btn btn dropdown-toggle mb-2"
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
        <li>
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
        <div v-if="showChatOptions">
          <li v-if="isFriend">
            <button @click="unfriendUser" class="dropdown-item" type="button">
              Unfriend
            </button>
          </li>
          <li>
            <hr class="dropdown-divider" />
          </li>
          <li v-if="isAdmin">
            <button @click="muteUser" class="dropdown-item" type="button">
              Mute
            </button>
          </li>
          <li v-if="isAdmin">
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
import { useSocketStore } from "@/stores/SocketStore";
import { challengeUser } from "@/utils/Pong";
import { sendFriendRequest, unfriend, unblock, block } from "@/utils/Friends";
import { stopTrackingUserStatus, trackUserStatus } from "@/utils/StatusTracker";
import type { StatusUpdate } from "@/types/StatusTypes";

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
  },
  data() {
    return {
      status: "",
    };
  },
  computed: {
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
      console.log("online", this.status === "ONLINE");
      return this.status === "ONLINE"
        ? "btn-outline-success"
        : "btn-outline-danger";
    },
    isOffline() {
      return this.status === "OFFLINE";
    },
    canObserve() {
      return [ "PLAYING" , "OBSERVING" ].includes(this.status);
    },
    isAdmin() {
      // SELF === the user that is controlling the frontend (userStore), not the user the dropdown belongs to
      // true if SELF is ADMIN in chat
      return true;
    },
    canMakeAdmin() {
      // true if SELF (controller) is owner and USER is NOT admin
      return true;
    },
    canRemoveAdmin() {
      // true if SELF! is owner of chat and USER is admin
      return true;
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
      console.log("friend state:", update);
      this.status = update.newState;
    },
    startDirectMessage() {
      return;
    },
    muteUser() {
      return;
    },
    banUser() {
      return;
    },
    makeAdmin() {
      return;
    },
    removeAdmin() {
      return;
    },
    observeUser() {
      useSocketStore().pong!.emit("requestObserve", { userId: this.user.id });
    },
  },
  mounted() {
    this.status = this.user.status;
    trackUserStatus(this.user.id, this.trackState);
  },
  unmounted() {
    stopTrackingUserStatus(this.user.id, this.trackState);
  },
});
</script>
