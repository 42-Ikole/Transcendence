<template>
    <h3> Pending Requests </h3>
    <div v-for="user in friendRequests" :key="user.id">
        {{ user.username }}
        <button @click="accept(user)"> Accept </button>
        <button @click="reject(user)"> Reject </button>
    </div>

    <h3> Friends </h3>
    <div v-for="user in friends" :key="user.id">
        <p> {{ user.username }} </p>
        <button @click="unfriend(user)"> Unfriend </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useFriendStore } from "@/stores/FriendStore";
import { PublicUser } from "@/types/UserType";
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";

export default defineComponent({
    computed: {
        ...mapState(useFriendStore, ["friends", "friendRequests"]),
    },
    methods: {
        unfriend(user: PublicUser) {
            makeApiCall(`/friend/unfriend/${user.id}`, {
                method: "DELETE",
            });
        },
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
