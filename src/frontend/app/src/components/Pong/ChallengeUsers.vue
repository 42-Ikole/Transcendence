<template>
  <p>
    <button @click="refresh">Refresh Users</button>
  </p>
  <div v-for="user in users" :key="user.id">
    {{ displayUser(user) }}
    <button @click="challenge(user, false)">Challenge</button>
    <button @click="challenge(user, true)">Challenge Default Mode</button>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
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
    challenge(user: any, mode: boolean) {
      console.log("challenge:", user);
      useSocketStore().pong!.emit("requestMatch", {
        type: "challenge",
        targetId: user.id,
        default: mode,
      });
    },
  },
  mounted() {
    this.refresh();
  },
});
</script>
