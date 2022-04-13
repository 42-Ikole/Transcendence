<template>
  <div v-if="loaded">
    <ProfileComponent :profileData="profileData" />
  </div>
  <div v-else-if="error">
    <p>error encountered</p>
  </div>
  <div v-else>
    <!-- TODO: loading component -->
    <p>loading...</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProfileComponent from "@/components/profile/ProfileComponent.vue";
import { useUserStore } from "@/stores/UserStore";
import type { UserProfileData } from "@/types/UserType";
import { makeApiCall } from "@/utils/ApiCall";

interface DataObject {
  profileData?: UserProfileData;
  loaded: boolean;
  error: boolean;
}

export default defineComponent({
  components: {
    ProfileComponent,
  },
  data(): DataObject {
    return {
      profileData: undefined,
      loaded: false,
      error: false,
    };
  },
  methods: {
    async loadUser(id: string) {
      if (!id || isNaN(id) || parseInt(id) === useUserStore().profileData!.id) {
        this.loadSelf();
        return;
      }
      const response = await makeApiCall(`/user/${id}`);
      if (!response.ok) {
        this.error = true;
        return;
      }
      this.profileData = await response.json();
      this.loaded = true;
    },
    loadSelf() {
      this.profileData = useUserStore().profileData;
      this.loaded = true;
    },
  },
  watch: {
    "$route.params.id"(value) {
      this.loadUser(this.$route.params.id);
    }
  },
  async mounted() {
    await this.loadUser(this.$route.params.id);
  },
});
</script>
