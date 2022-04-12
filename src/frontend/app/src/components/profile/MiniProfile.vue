<template>
  <RouterLink :to="profileLink">
    <img class="MiniProfile" :src="avatar">
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
	avatar () {
		return `http://localhost:3000/user/avatar/${this.user.id}/420`;
	},
  },
});
</script>

<style>

.MiniProfile {
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 75px;
  width: 75px;
}
</style>
