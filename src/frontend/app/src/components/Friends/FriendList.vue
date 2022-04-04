<template>
    <h3> Pending Requests </h3>
    <div v-for="user in sentRequests" :key="user.id">
        {{ user.username }}
        <button @click="cancelRequest(user)"> Cancel </button>
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
import { makeApiCall } from "@/utils/ApiCall";

export default defineComponent({
    computed: {
        ...mapState(useFriendStore, ["friends", "sentRequests"]),
    },
    methods: {
        unfriend(user: PublicUser) {
            makeApiCall(`/friend/unfriend/${user.id}`, {
                method: "DELETE",
            });
        },
        cancelRequest(user: PublicUser) {
            makeApiCall(`/friend/request/cancel/${user.id}`, {
                method: "DELETE",
            });
        },
    },
});
</script>
