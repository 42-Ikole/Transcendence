<template>
  <div class="container">
    <div class="mb-3">
      <EditUsername @update="refreshUserData" />
    </div>
    <div class="mb-3">
      <EditTwoFactor @update="refreshUserData" />
    </div>
    <div class="mb-3">
      <EditAvatar />
    </div>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";
import EditTwoFactor from "@/components/profile/edit/EditTwoFactor.vue";
import EditUsername from "@/components/profile/edit/EditUsername.vue";
import EditAvatar from "@/components/profile/edit/EditAvatar.vue";

export default defineComponent({
  components: {
    EditTwoFactor,
    EditUsername,
    EditAvatar,
  },
  methods: {
    refreshUserData() {
      useUserStore().refreshUserData();
    },
  },
});
</script>
