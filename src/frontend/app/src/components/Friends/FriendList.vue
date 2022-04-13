<template>
  <div v-if="noFriends">
    <p>You have no friends... :(</p>
  </div>
  <div v-else v-for="user in friends" :key="user.id">
    <p>
      <ChatUserDropdown :user="user" :show-chat-options="false" />
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import type { PublicUser } from "@/types/UserType";
import { unfriend } from "@/utils/Friends";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";

export default defineComponent({
    computed: {
        ...mapState(useFriendStore, ["friends"]),
        noFriends(): boolean {
            return this.friends.length === 0;
        },
    },
    methods: {
        unfriendUser(user: PublicUser) {
            unfriend(user);
        },
    },
    components: { ChatUserDropdown }
});
</script>
