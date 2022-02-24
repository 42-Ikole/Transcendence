<template>
  <div>
    <button @click="makeApiCall">Make Api Call</button>
  </div>

  <p>{{ text }}</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  data() {
    return {
      text: "",
    };
  },
  methods: {
    async makeApiCall() {
      try {
        const response = await fetch("api/ingmar");
        console.log(response);
        this.text = await response.text();
      } catch (error) {
        console.log(error);
      }
    },
  },
});
</script>
