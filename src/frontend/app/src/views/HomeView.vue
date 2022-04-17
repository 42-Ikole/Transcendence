<template>
  <p>Hey :)</p>
  <DirectMessageList />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import DirectMessageList from "../components/DirectMessage/DirectMessageList.vue";

export default defineComponent({
    name: "HomeView",
    computed: {
        ...mapState(useUserStore, ["profileData"]),
    },
    components: { DirectMessageList }
});
</script>
