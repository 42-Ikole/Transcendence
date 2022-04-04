<template>
  <button
    v-for="state in states" :key="state"
    class="btn btn-outline-light btn-sm"
    @click="setState(state)">
    {{ state }}
  </button>
  <hr>
  <FriendList v-if="state === 'FRIENDS'" />
  <BlockList v-else-if="state === 'BLOCKED'" />
  <FriendRequest v-else-if="state === 'REQUESTS'" />
  <OnlineUsers v-else-if="state === 'USERS'" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import FriendList from "@/components/Friends/FriendList.vue";
import OnlineUsers from "@/components/Friends/OnlineUsers.vue";
import BlockList from "@/components/Friends/BlockList.vue";
import FriendRequest from "@/components/Friends/FriendRequest.vue";

type FriendListStates = "FRIENDS" | "BLOCKED" | "REQUESTS" | "USERS";

interface DataObject {
  state: FriendListStates;
  states: FriendListStates[];
}

export default defineComponent({
  data(): DataObject {
    return {
      state: "FRIENDS",
      states: [ "FRIENDS", "BLOCKED", "REQUESTS", "USERS" ],
    }
  },
  components: {
    FriendList,
    OnlineUsers,
    BlockList,
    FriendRequest,
  },
  methods: {
    setState(state: FriendListStates) {
      this.state = state;
    }
  },
});
</script>
