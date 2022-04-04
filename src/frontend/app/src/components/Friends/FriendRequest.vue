<template>
    <h2> Requests </h2>
    <div v-for="user in friendRequests" :key="user.id">
        <p> {{ user.username }} </p>
        <button @click="accept(user)"> Accept </button>
        <button @click="reject(user)"> Reject </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import { PublicUser } from "@/types/UserType";
import { makeApiCallJson } from "@/utils/ApiCall";

export default defineComponent({
    computed: {
        ...mapState(useFriendStore, ["friendRequests"]),
    },
    methods: {
        accept(user: PublicUser) {
            this.makeCall(user, "accept");
        },
        reject(user: PublicUser) {
            this.makeCall(user, "reject");
        },
        makeCall(user: PublicUser, type: "reject" | "accept") {
            makeApiCallJson(`friend/request/${type}`, "POST", {
                id: user.id,
            });
        }
    },
});
</script>
