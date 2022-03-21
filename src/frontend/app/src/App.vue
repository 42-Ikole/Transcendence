<template>
  <header>
    <div>
      <NavBar />
    </div>
  </header>
  <div class="m-3">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { RouterView } from "vue-router";
import NavBar from "@/components/NavBar.vue";

export default defineComponent({
  components: {
    NavBar,
    RouterView,
  },
});
</script>
