<template>
  <p>{{ prop.id }}</p>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

interface ChatRoom {
  id: number;
}

export default defineComponent({
  props: {
    prop: {
      type: Object as PropType<ChatRoom>,
      required: true,
    },
  },
});
</script>
