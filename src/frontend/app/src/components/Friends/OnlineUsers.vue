<template>
  <h2>Online Users</h2>
  <div v-for="user in users" :key="user.id">
    <p>{{ user.username }} : {{ user.id }}</p>
    <button @click="sendFriendRequest(user)">Send Friend Request</button>
    <button @click="blockUser(user)">Block</button>
    <hr />
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { useUserStore } from "@/stores/UserStore";
import type { PublicUser, UserProfileData } from "@/types/UserType";
import makeApiCall, { makeApiCallJson } from "@/utils/ApiCall";
import { mapState } from "pinia";
import { defineComponent, type PropType } from "vue";

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
    async sendFriendRequest(user: PublicUser) {
      await makeApiCallJson("friend/request", "POST", {
        id: user.id,
      });
    },
    async blockUser(user: PublicUser) {
      await makeApiCallJson("friend/block", "POST", {
        id: user.id,
      });
    },
    async refresh() {
      const response = await makeApiCall("/user/all");
      this.users = await response.json();
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
