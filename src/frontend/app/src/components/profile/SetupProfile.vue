<template>
  <div>
    <EditUsername  />
    <EditAvatar />
	<button
		type="button"
		class="btn-lg btn-success"
		@click="finishSetup"
	>
	Finish setup!
	</button>
  </div>
</template>

<script lang="ts">
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";
import EditAvatar from "./edit/EditAvatar.vue";
import EditUsername from "./edit/EditUsername.vue";

export default defineComponent({
  components: { EditAvatar, EditUsername },
  methods: {
    finishSetup() {
      useUserStore().login();
    },
  },
});
</script>
