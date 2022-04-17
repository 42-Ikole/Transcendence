<template>
<div v-if="isDefined">
    <div class="container">
        <div v-if="isBlocked">
            <p class="text-warning"> You have blocked this user</p>
            <button @click="unblockUser">Unblock</button>
        </div>
        <div v-else-if="isBlockedBy">
            <p class="text-warning"> Blocked by other user: cannot send messages</p>
        </div>
        <div v-else>
            <DisplayMessages :messages="messages" />
            <SendMessage :chat-id="directMessageId" />
        </div>
    </div>
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
import DisplayMessages from "./DisplayMessages.vue";
import { useFriendStore } from "@/stores/FriendStore";
import { useUserStore } from "@/stores/UserStore";
import { unblock } from "@/utils/Friends";

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
        isBlockedBy() {
            if (!this.otherUser) {
                return false;
            }
            return useFriendStore().isPartOfSet(this.otherUser.id, "BLOCKED_BY");
        },
        isBlocked() {
            if (!this.otherUser) {
                return false;
            }
            return useFriendStore().isPartOfSet(this.otherUser.id, "BLOCKED");
        },
        otherUser() {
            if (!this.userOne || !this.userTwo) {
                return undefined;
            }
            if (useUserStore().profileData!.id === this.userOne.id) {
                return this.userTwo;
            }
            return this.userOne;
        },
    },
    methods: {
        receiveMessage(message: Message) {
            this.messages.push(message);
        },
        unblockUser() {
            if (!this.otherUser) {
                return;
            }
            unblock(this.otherUser);
        },
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
    components: { SendMessage, DisplayMessages }
})
</script>
