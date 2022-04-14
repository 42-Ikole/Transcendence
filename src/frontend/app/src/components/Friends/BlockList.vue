<template>
  <div v-if="hasBlocked">
    <p>You have no blocked users.</p>
  </div>
  <div v-else v-for="user in blockedUsers" :key="user.id">
    <p>
      {{ user.username }}
      <button class="btn btn-outline-light btn-sm" @click="unblockUser(user)">
        Unblock
      </button>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import type { PublicUser } from "@/types/UserType";
import { unblock } from "@/utils/Friends";

export default defineComponent({
  computed: {
    ...mapState(useFriendStore, ["blockedUsers"]),
    hasBlocked(): boolean {
      return this.blockedUsers.length === 0;
    },
  },
  methods: {
    unblockUser(user: PublicUser) {
      unblock(user);
    },
  },
});
</script>
