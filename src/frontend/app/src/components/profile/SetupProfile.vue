<template>
  <div>
    <EditUsername @updatedUsername="updatedUsername" />
    <EditAvatar />
    <button
      type="button"
      class="btn btn-lg btn-success"
      @click="finishSetup"
      :disabled="hasSetUsername"
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

interface DataObject {
  usernameNotSet: boolean;
}

export default defineComponent({
  data(): DataObject {
    return {
      usernameNotSet: true,
    };
  },
  components: { EditAvatar, EditUsername },
  methods: {
    finishSetup() {
      useUserStore().login();
    },
    updatedUsername() {
      this.usernameNotSet = false;
    },
  },
  computed: {
    hasSetUsername() {
      return this.usernameNotSet;
    },
  },
});
</script>
