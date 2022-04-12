<template>
  <div v-if="noFriends">
    <p>You have no friends... :(</p>
  </div>
  <div v-else v-for="user in friends" :key="user.id">
    <p>
      {{ user.username }}
      <button class="btn btn-outline-light btn-sm" @click="unfriend(user)">
        Unfriend
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
    ...mapState(useFriendStore, ["friends"]),
    noFriends(): boolean {
      return this.friends.length === 0;
    },
  },
  methods: {
    unfriend(user: PublicUser) {
      makeApiCall(`/friend/unfriend/${user.id}`, {
        method: "DELETE",
      });
    },
  },
});
</script>
