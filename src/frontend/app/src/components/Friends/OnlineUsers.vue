<template>
  <h2>All Users</h2>
  <div v-for="user in users" :key="user.id">
    <div v-if="isOtherUser(user)">
      <p>{{ user.username }} : {{ user.id }}</p>
      <button
        class="btn btn-outline-light btn-sm"
        @click="sendFriendRequestUser(user)"
      >
        Send Friend Request
      </button>
      <button class="btn btn-outline-light btn-sm" @click="blockUser(user)">
        Block
      </button>
      <hr />
    </div>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { useUserStore } from "@/stores/UserStore";
import type { PublicUser } from "@/types/UserType";
import makeApiCall, { makeApiCallJson } from "@/utils/ApiCall";
import { mapState } from "pinia";
import { block, sendFriendRequest } from "@/utils/Friends";
import { defineComponent } from "vue";

interface DataObject {
  users: PublicUser[];
}

export default defineComponent({
  data(): DataObject {
    return {
      users: [],
    };
  },
  computed: {
    ...mapState(useUserStore, {
      you: "profileData",
    }),
  },
  methods: {
    async sendFriendRequestUser(user: PublicUser) {
      sendFriendRequest(user);
    },
    async blockUser(user: PublicUser) {
      block(user);
    },
    async refresh() {
      const response = await makeApiCall("/user/all");
      this.users = await response.json();
    },
    isOtherUser(user: PublicUser): boolean {
      return user.id !== useUserStore().profileData!.id;
    },
  },
  async mounted() {
    await this.refresh();
    useSocketStore().status!.on("friendUpdate", this.refresh);
  },
  unmounted() {
    useSocketStore().status!.removeListener("friendUpdate", this.refresh);
  },
});
</script>
