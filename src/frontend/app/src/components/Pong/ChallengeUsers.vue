<template>
  <p>
    <button class="btn btn-outline-light btn-lg px-5 me-2" @click="refresh">
      Refresh Users
    </button>
  </p>
  <div v-for="user in users" :key="user.id">
    <div class="card bg-dark mt-2" style="max-width: 500px">
      <div class="row g-0">
        <div class="col-md-6">
          <h5 class="card-title text-center">{{ user.username }}</h5>
        </div>
        <div class="col-md-4">
          <div class="card-body">
            <button
              class="btn btn-outline-light"
              @click="challenge(user, false)"
            >
              Challenge
            </button>
            <button
              class="btn btn-outline-light"
              @click="challenge(user, true)"
            >
              Challenge [Default mode]
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.text-center {
  top: 25%;
}
</style>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import type { PublicUser } from "@/types/UserType";
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";
import { challengeUser } from "@/utils/Pong";

interface DataObject {
  users: PublicUser[];
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
    challenge(user: PublicUser, mode: boolean) {
      console.log("challenge:", user);
      challengeUser(user.id, mode);
    },
  },
  mounted() {
    this.refresh();
  },
});
</script>
