<template>
  <div class="text-center">
    <p>User [{{ username }}] challenged you</p>
    <p>Game Mode: {{ gameMode }}</p>
    <p>
      <button class="btn btn-outline-light" @click="accept">Accept</button>
      <button class="btn btn-outline-light" @click="reject">Reject</button>
    </p>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";

interface ChallengeData {
  id: number;
  defaultMode: boolean;
}

interface DataObject {
  data: ChallengeData;
  username: string;
}

export default defineComponent({
  data(): DataObject {
    return {
      data: { id: 0, defaultMode: false },
      username: "",
    };
  },
  methods: {
    accept() {
      useSocketStore().pong!.emit("acceptChallenge");
    },
    reject() {
      useSocketStore().pong!.emit("rejectChallenge");
    },
  },
  computed: {
    gameMode() {
      if (this.data.defaultMode) {
        return "default";
      }
      return "special";
    },
  },
  async mounted() {
    const response = await makeApiCall("/pong/challengeData");
    this.data = await response.json();
    const profileResponse = await makeApiCall("/user/1");
    const profile: PublicUser = await profileResponse.json();
    this.username = profile.username;
  },
});
</script>
