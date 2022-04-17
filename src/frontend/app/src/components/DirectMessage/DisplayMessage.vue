<template>
<div>
	<p class="text-white">
		{{ message.author.username }}:
		{{ message.message }}
	</p>
</div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import type { Message } from "./DirectMessage.types";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";

export default defineComponent({
    props: {
        message: {
            type: Object as PropType<Message>,
            required: true,
        }
    },
    components: { ChatUserDropdown }
});
</script>
