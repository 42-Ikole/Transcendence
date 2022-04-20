<template>
  <div class="card-footer d-flex justify-content-start p-3">
    <form class="input-group" @submit.prevent="sendMessage">
      <input
        class="form-control form-control-lg"
        type="text"
        placeholder="Type message"
        v-model="myMessage"
        ref="messageBox"
        maxlength="250"
      />
      <input
        class="btn btn-lg btn-outline-info btn-rounded float-end"
        type="submit"
        value="Send"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { useSocketStore } from "@/stores/SocketStore";
import { mapState } from "pinia";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    chatId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      myMessage: "",
    };
  },
  computed: {
    ...mapState(useSocketStore, ["chat"]),
  },
  methods: {
    sendMessage() {
      if (!this.myMessage) {
        return;
      }
      // Emit DM to target user
      this.chat!.emit("sendDirectMessage", {
        id: this.chatId,
        message: this.myMessage,
      });
      this.myMessage = "";
    },
  },
});
</script>
