<template>
  <p>Hey :)</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  name: "HomeView",
  computed: {
    ...mapState(useUserStore, ["profileData"]),
  },
});
</script>
