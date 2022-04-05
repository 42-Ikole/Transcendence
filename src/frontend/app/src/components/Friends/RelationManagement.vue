<template>
  <UserList name="Friends" :users="friends" />
  <UserList name="Received Requests" :users="friendRequests" />
  <UserList name="Sent Requests" :users="sentRequests" />
  <UserList name="Blocked Users" :users="blockedUsers" />
  <UserList name="Blocked By Users" :users="blockedByUsers" />
  <hr />
  <OnlineUsers />
</template>

<script lang="ts">
import { useFriendStore } from "@/stores/FriendStore";
import makeApiCall from "@/utils/ApiCall";
import { mapState } from "pinia";
import { defineComponent } from "vue";
import UserList from "./UserList.vue";
import OnlineUsers from "./OnlineUsers.vue";
import { useSocketStore } from "@/stores/SocketStore";

export default defineComponent({
  computed: {
    ...mapState(useFriendStore, [
      "friends",
      "friendRequests",
      "sentRequests",
      "blockedUsers",
      "blockedByUsers",
    ]),
  },
  async mounted() {
    await useFriendStore().refresh();
    useSocketStore().status!.on("friendUpdate", useFriendStore().refresh);
  },
  unmounted() {
    useSocketStore().status!.removeListener(
      "friendUpdate",
      useFriendStore().refresh
    );
  },
  components: {
    UserList,
    OnlineUsers,
  },
});
</script>
