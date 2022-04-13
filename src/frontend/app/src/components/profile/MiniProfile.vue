<template>
  <RouterLink :to="profileLink">
    <div class="MiniProfile" :style="avatar"></div>
    <p class="text-white mp-name">
      {{ this.user.username }}
    </p>
  </RouterLink>
</template>

<script lang="ts">
import type { PublicUser } from "@/types/UserType";
import { defineComponent, type PropType } from "vue";
import { RouterLink } from "vue-router";

export default defineComponent({
  components: {
    RouterLink,
  },
  props: {
    user: {
      type: Object as PropType<PublicUser>,
      required: true,
    },
  },
  computed: {
    profileLink() {
      return `/profile/${this.user.id}`;
    },
    avatar() {
      return `background-image: url(http://localhost:3000/user/avatar/${this.user.id}/420)`;
    },
  },
});
</script>

<style>
a:link {
  text-decoration: none;
}

.mp-name {
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
}

.MiniProfile {
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 75px;
  width: 75px;
}
</style>
