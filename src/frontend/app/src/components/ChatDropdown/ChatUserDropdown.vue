<template>
  <!-- TODO: filter if ISSELF (maybe show regular dropdown) -->
  <div class="input-group">
    <button class="btn btn-outline-light btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ user.username }}</button>
    <ul class="dropdown-menu">
        <li><h6 class="dropdown-header"> {{ status }}</h6></li>
        <li><button @click="viewProfile" class="dropdown-item" type="button">View Profile</button></li>
        <li v-if="isOnline"><button @click="sendChallenge" class="dropdown-item" type="button">Send Challenge</button></li>
        <li v-if="!isBlocked"><button @click="blockUser" class="dropdown-item" type="button">Block</button></li>
        <li v-if="isBlocked"><button @click="unblockUser" class="dropdown-item" type="button">Unblock</button></li>
        <li v-if="hasNoRelation"><button @click="sendFriendRequestUser" class="dropdown-item" type="button">Send Friend Request</button></li>
        <li v-if="isFriend"><button @click="unfriendUser" class="dropdown-item" type="button">Unfriend</button></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { PublicUser } from "@/types/UserType";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import { challengeUser } from "@/utils/Pong";
import { sendFriendRequest, unfriend, unblock, block } from "@/utils/Friends";
import { stopTrackingUserStatus, trackUserStatus } from "@/utils/StatusTracker";
import type { StatusUpdate } from "@/types/StatusTypes";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<PublicUser>,
      required: true,
    }
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
      unblock(this.user);;
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
    }
  },
  mounted(){
    this.status = this.user.status;
    trackUserStatus(this.user.id, this.trackState);
  },
  unmounted() {
    stopTrackingUserStatus(this.user.id, this.trackState);
  },
});
</script>
