<template>
  <h5 class="dropdown-header">Banned users:</h5>
  <ul class="btn" v-for="user in bannedUsers" :key="user.id">
    <div>
      <button class="dropdown-item" @click="unbanUser(user)">
        Unban: {{ user.username }}
      </button>
    </div>
  </ul>
  <hr class="dropdown-divider" />
  <h5 class="dropdown-header">Muted users:</h5>
  <ul class="btn" v-for="user in mutedUsers" :key="user.id">
    <div>
      <button class="dropdown-item" @click="unmuteUser(user)">
        Unmute: {{ user.username }}
      </button>
    </div>
  </ul>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { makeApiCallJson } from "@/utils/ApiCall";
import type { PublicUser } from "@/types/UserType";

export default defineComponent({
  props: {
    chatId: {
      type: Number,
      required: true,
    },
    bannedUsers: {
      type: Array as PropType<PublicUser[]>,
      required: true,
    },
    mutedUsers: {
      type: Array as PropType<PublicUser[]>,
      required: true,
    },
  },
  methods: {
    async unbanUser(user: PublicUser) {
      await makeApiCallJson("/chat/ban", "DELETE", {
        chatId: this.chatId,
        userId: user.id,
      });
    },
    async unmuteUser(user: PublicUser) {
      await makeApiCallJson("/chat/mute", "DELETE", {
        chatId: this.chatId,
        userId: user.id,
      });
    },
  },
});
</script>
