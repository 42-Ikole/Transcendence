<template>
  <h3>{{ name }}</h3>
  <div v-for="user in users" :key="user.id">
    <p>{{ user.username }} - {{ user.status }}</p>
  </div>
  <hr />
</template>

<script lang="ts">
import type { PublicUser } from "@/types/UserType";
import { defineComponent, type PropType } from "vue";

export default defineComponent({
  props: {
    name: String,
    users: {
      type: Object as PropType<PublicUser[]>,
      required: true,
    },
  },
  methods: {
    test() {
      console.log(this.users[0]);
    },
  },
});
</script>
