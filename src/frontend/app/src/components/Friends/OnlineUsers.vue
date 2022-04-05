<template>
  <h2>Online Users</h2>
  <div v-for="user in users" :key="user.id">
    <p>{{ user.username }} : {{ user.id }}</p>
    <button @click="sendFriendRequest(user)">Send Friend Request</button>
    <button @click="rejectFriendRequest(user)">Reject Friend Request</button>
    <button @click="acceptFriendRequest(user)">Accept Friend Request</button>
    <button @click="removeFriend(user)">Remove Friend</button>
    <button @click="blockUser(user)">Block</button>
    <button @click="unblockUser(user)">Unblock</button>
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
    async rejectFriendRequest(user: PublicUser) {
      await makeApiCallJson("friend/request/reject", "POST", {
        id: user.id,
      });
    },
    async acceptFriendRequest(user: PublicUser) {
      await makeApiCallJson("friend/request/accept", "POST", {
        id: user.id,
      });
    },
    async removeFriend(user: PublicUser) {
      await makeApiCall(`friend/unfriend/${user.id}`, {
        method: "DELETE",
      });
    },
    async blockUser(user: PublicUser) {
      await makeApiCallJson("friend/block", "POST", {
        id: user.id,
      });
    },
    async unblockUser(user: PublicUser) {
      await makeApiCall(`friend/unblock/${user.id}`, {
        method: "DELETE",
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
