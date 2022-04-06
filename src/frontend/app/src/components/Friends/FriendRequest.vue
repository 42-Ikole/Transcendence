<template>
  <div v-if="hasRequests">
    <p>You have no pending friend requests.</p>
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
import { makeApiCall } from "@/utils/ApiCall";

export default defineComponent({
  computed: {
    ...mapState(useFriendStore, ["sentRequests"]),
    hasRequests(): boolean {
      return this.sentRequests.length === 0;
    },
  },
  methods: {
    cancelRequest(user: PublicUser) {
      makeApiCall(`/friend/request/cancel/${user.id}`, {
        method: "DELETE",
      });
    },
  },
});
</script>
