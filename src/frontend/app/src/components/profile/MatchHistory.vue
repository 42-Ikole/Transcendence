<template>
  <h2>Match history</h2>
  <button class="btn btn-outline-light m-2" @click="refresh">
    <IRefresh /> Refresh Matches
  </button>

  <div class="row">
    <div v-for="match in filteredMatches" :key="match.id" class="col-sm-6">
      <MatchCard :match="match" />
    </div>
    <button v-if="showLess" class="btn btn-outline-light m-2" @click="showLess = !showLess">Show More </button>
    <button v-else class="btn btn-outline-light m-2" @click="showLess = !showLess">Show Less </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import MatchCard from "@/components/Pong/MatchCard.vue";
import { makeApiCall } from "@/utils/ApiCall";
import type { Match } from "@/types/MatchType";
import IRefresh from "@/components/icons/IconRefresh.vue";

interface DataObject {
  matches: Match[];
  showLess: boolean;
};

export default defineComponent({
  components: {
    MatchCard,
	IRefresh,
  },
  data(): DataObject {
    return {
      matches: [],
      showLess: true,
    };
  },
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    filteredMatches() {
      if (this.showLess) {
        return this.matches.slice().reverse().slice(0, 2);
      }
      return this.matches.slice().reverse();
    },
  },
  methods: {
    async refresh() {
      const response = await makeApiCall(`/match/userMatches/${this.userId}`);
      this.matches = await response.json();
    },
  },
  async mounted() {
    await this.refresh();
  },
});
</script>
