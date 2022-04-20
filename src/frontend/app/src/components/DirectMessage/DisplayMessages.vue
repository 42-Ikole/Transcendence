<template>
  <div class="card mt-2">
    <div
      id="autoScrollBottom"
      class="card-body mx-5"
      style="height: 70vh; overflow-y: scroll; padding-bottom: 25px"
    >
      <DisplayMessage
        v-for="message in messages"
        :key="message.id"
        :message="message"
      >
        {{ message.message }}
      </DisplayMessage>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Message } from "./DirectMessage.types";
import DisplayMessage from "./DisplayMessage.vue";

export default defineComponent({
  props: {
    messages: {
      type: Object as PropType<Message[]>,
      required: true,
    },
  },
  watch: {
    messages: {
      deep: true,
      handler() {
        this.$nextTick(() => {
          this.scrollBottom();
        });
      },
    },
  },
  methods: {
    scrollBottom() {
      const autoScroll = this.$el.querySelector("#autoScrollBottom");
      autoScroll.scrollTop = autoScroll.scrollHeight;
    },
  },
  mounted() {
    this.scrollBottom();
  },
  components: { DisplayMessage },
});
</script>
