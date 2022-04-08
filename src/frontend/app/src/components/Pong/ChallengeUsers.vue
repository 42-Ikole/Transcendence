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
            <button class="btn btn-outline-light" @click="challenge(user)">
              Challenge
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
    challenge(user: PublicUser) {
      console.log("challenge:", user);
      useSocketStore().pong!.emit("requestMatch", {
        type: "challenge",
        targetId: user.id,
      });
    },
  },
  mounted() {
    this.refresh();
  },
});
</script>
