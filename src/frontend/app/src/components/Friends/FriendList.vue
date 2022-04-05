<template>
  <div v-for="user in friendRequests" :key="user.id">
    <p>
      Friend Request: {{ user.username }}
      <button class="btn btn-outline-light btn-sm" @click="accept(user)">
        Accept
      </button>
      <button class="btn btn-outline-light btn-sm" @click="reject(user)">
        Reject
      </button>
    </p>
  </div>

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
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";

export default defineComponent({
  computed: {
    ...mapState(useFriendStore, ["friends", "friendRequests"]),
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
    accept(user: PublicUser) {
      this.makeCall(user, "accept");
    },
    reject(user: PublicUser) {
      this.makeCall(user, "reject");
    },
    makeCall(user: PublicUser, type: "reject" | "accept") {
      makeApiCallJson(`friend/request/${type}`, "POST", {
        id: user.id,
      });
    },
  },
});
</script>
