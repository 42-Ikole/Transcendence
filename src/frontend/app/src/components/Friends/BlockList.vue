<template>
    <h2>Blocked Users </h2>
    <div v-for="user in blockedUsers" :key="user.id">
        <p> {{ user.username }} </p>
        <button @click="unblock(user)"> Unblock </button>
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
        ...mapState(useFriendStore, ["blockedUsers"]),
    },
    methods: {
        unblock(user: PublicUser) {
            makeApiCall(`/friend/unblock/${user.id}`, {
                method: "DELETE",
            });
        },
    },
});
</script>
