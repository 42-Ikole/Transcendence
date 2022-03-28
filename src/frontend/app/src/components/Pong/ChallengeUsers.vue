<template>
  <p>
    <button @click="refresh">Refresh Users</button>
  </p>
  <div v-for="user in users" :key="user.id">
    {{ displayUser(user) }}
    <button @click="challenge(user)">Challenge</button>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { useUserStore } from "@/stores/UserStore";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";

interface DataObject {
  users: any[];
}

export default defineComponent({
  data(): DataObject {
    return {
      users: [],
    };
  },
  methods: {
    async refresh() {
      const response = await makeApiCall("/pong/users");
      if (response.ok) {
        this.users = await response.json();
      }
    },
    displayUser(user: any) {
      return `${user.username}`;
    },
    challenge(user: any) {
      console.log("challenge:", user);
      useSocketStore().pong!.emit("requestMatch", {
        type: "challenge",
        targetId: user.id,
      });
      useUserStore().setState("SEARCHING");
    },
  },
  mounted() {
    this.refresh();
  },
});
</script>
