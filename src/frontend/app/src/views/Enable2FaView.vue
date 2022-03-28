<template>
  <Enable2Fa />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Enable2Fa from "@/components/Authentication/Enable2Fa.vue";

export default defineComponent({
  components: {
    Enable2Fa,
  },
});
</script>
