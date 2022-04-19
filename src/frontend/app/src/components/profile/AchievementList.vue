<template>
  <h2>
    <i class="icon-big"><IconTrophy /></i> Achievements
  </h2>
  <hr />

  <div v-for="achievement in achievements" :key="achievement.id">
    <li class="text-white">
      {{ achievement.name }}
    </li>
    <p class="text-white-50">{{ achievement.description }}</p>
  </div>
</template>

<script lang="ts">
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";
import IconTrophy from "../icons/IconTrophy.vue";

interface Achievement {
  id: number;
  name: string;
  description: string;
}

interface DataObject {
  achievements: Achievement[];
}

export default defineComponent({
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  data(): DataObject {
    return {
      achievements: [],
    };
  },
  components: { IconTrophy },
  async mounted() {
    const response = await makeApiCall(`/user/achievements/${this.userId}`);
    if (response.ok) {
      this.achievements = await response.json();
    }
  },
});
</script>
