<template>
  <!-- TODO: filter if ISSELF (maybe show regular dropdown) -->
  <div class="input-group">
    <button class="btn btn-primary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ user.username }}</button>
    <ul class="dropdown-menu">
        <li><button @click="viewProfile" class="dropdown-item" type="button">View Profile</button></li>
        <li><button @click="sendChallenge" class="dropdown-item" type="button">Send Challenge</button></li>
        <li v-if="!isBlocked"><button @click="blockUser" class="dropdown-item" type="button">Block</button></li>
        <li v-if="isBlocked"><button @click="unblockUser" class="dropdown-item" type="button">Unblock</button></li>
        <li v-if="hasNoRelation"><button @click="sendFriendRequestUser" class="dropdown-item" type="button">Send Friend Request</button></li>
        <li v-if="isFriend"><button @click="unfriendUser" class="dropdown-item" type="button">Unfriend</button></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logoutUser } from "@/utils/Login";
import { mapState } from "pinia";
import LoggedOut from "@/components/Authentication/LoggedOut.vue";
import makeApiCall from "@/utils/ApiCall";
import { PublicUser } from "@/types/UserType";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import { challengeUser } from "@/utils/Pong";
import { sendFriendRequest, unfriend, unblock, block } from "@/utils/Friends";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<PublicUser>,
      required: true,
    }
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
  },
});
</script>
