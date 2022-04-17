<template>
<div v-if="isDefined">
    <div v-for="message in messages" :key="message.id">
        {{ message }}
    </div>
	<SendMessage :chat-id="directMessageId" />
</div>
<div v-else>
	<p> Loading Chat... </p>
</div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import makeApiCall from "@/utils/ApiCall";
import type { PublicUser } from "@/types/UserType";
import SendMessage from "./SendMessage.vue";
import { useSocketStore } from "@/stores/SocketStore";
import { mapState } from "pinia";
import type { Message } from "./DirectMessage.types";

interface DataObject {
	userOne: PublicUser | undefined;
	userTwo: PublicUser | undefined;
	messages: Message[];
}

export default defineComponent({
    props: {
        directMessageId: {
            type: Number,
            required: true,
        }
    },
    data(): DataObject {
        return {
            userOne: undefined,
            userTwo: undefined,
            messages: [],
        };
    },
    computed: {
        ...mapState(useSocketStore, ["chat"]),
        isDefined() {
            return this.userOne !== undefined && this.userTwo !== undefined;
        },
    },
    methods: {
        receiveMessage(message: Message) {
            this.messages.push(message);
        }
    },
    async mounted() {
        const response = await makeApiCall(`/chat/directMessage/${this.directMessageId}`);
        if (!response.ok) {
            console.error("failed to retrieve messages");
            return;
        }
        const dm = await response.json();
        this.messages = dm.messages;
        this.userOne = dm.userOne;
        this.userTwo = dm.userTwo;
        // subscribe
        this.chat!.emit('subscribeToDm', {
            id: this.directMessageId,
        });
        this.chat!.on(`directMessage_${this.directMessageId}`, this.receiveMessage);
    },
    unmounted() {
        // unsubscribe
        this.chat!.emit('unsubscribeToDm', {
            id: this.directMessageId,
        });
    },
    components: { SendMessage }
})
</script>
