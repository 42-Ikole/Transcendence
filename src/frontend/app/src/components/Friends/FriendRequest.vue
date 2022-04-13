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
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import type { PublicUser } from "@/types/UserType";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";

export default defineComponent({
  computed: {
    ...mapState(useFriendStore, ["sentRequests", "friendRequests"]),
    hasRequests(): boolean {
      return this.friendRequests.length === 0 && this.sentRequests.length === 0;
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
  },
});
</script>
