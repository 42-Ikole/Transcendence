<template>
  <div class="card text-white match-won">
    <div class="card-body">
      <div class="row">
        <div class="col-sm-4">
          <MiniProfile />
          <h3 class="text-white text-center">11</h3>
        </div>
        <div class="col-sm-auto">
          <h2 class="text-white texter-center">VS</h2>
        </div>
        <div class="col-sm-4 ms-auto">
          <MiniProfile />
          <h3 class="text-white text-center">6</h3>
        </div>
      </div>
      <p class="card-text">17:48 28/03/2022</p>
    </div>
  </div>
</template>

<style>
.match-won {
  background-color: #088c12 !important;
}

.match-lost {
  background-color: #c51010 !important;
}

.texter-center {
  top: 25%;
}
</style>

<script lang="ts">
import { defineComponent } from "vue";
import MiniProfile from "@/components/profile/MiniProfile.vue";

export default defineComponent({
  components: {
    MiniProfile,
  },
});
</script>
