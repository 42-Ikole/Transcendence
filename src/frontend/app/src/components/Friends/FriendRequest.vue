<template>
    <h2> Sent Requests </h2>
    <div v-for="user in sentRequests" :key="user.id">
        {{ user.username }}
        <button @click="cancelRequest(user)"> Cancel </button>
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
        ...mapState(useFriendStore, ["sentRequests"]),
    },
    methods: {
        cancelRequest(user: PublicUser) {
            makeApiCall(`/friend/request/cancel/${user.id}`, {
                method: "DELETE",
            });
        },
    },
});
</script>
