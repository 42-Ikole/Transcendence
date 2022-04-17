<template>
  <div class="message">
    <div>
        <ChatUserDropdown :user="message.author" :show-chat-options="false"/>
    </div>
    <div class="flex mx-2">
      <slot />
    </div>
    <hr/>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Message } from "./DirectMessage.types";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
    props: {
        message: {
            type: Object as PropType<Message>,
            required: true,
        }
    },
    computed: {
      isSender() {
        return useUserStore().profileData!.id === this.message.author.id;
      },
    },
    components: { ChatUserDropdown },
});
</script>
