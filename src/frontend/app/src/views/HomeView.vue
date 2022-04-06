<template>
  <p>Hey :)</p>
  <ChatUserDropdown :user="profileData" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PublicUser } from "@/types/UserType";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import ChatUserDropdown from "@/components/ChatDropdown/ChatUserDropdown.vue";

export default defineComponent({
  name: "HomeView",
  computed: {
    ...mapState(useUserStore, ["profileData"]),
  },
  components: {
    ChatUserDropdown,
  },
});
</script>
