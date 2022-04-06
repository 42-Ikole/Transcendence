<template>
  <div class="input-group mb-3">
    <button class="btn btn-outline-light dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{{ user.username }}</button>
    <ul class="dropdown-menu">
        <li><button class="dropdown-item" type="button">View Profile</button></li>
        <li><button class="dropdown-item" type="button">Send Challenge</button></li>
        <li v-if="!isBlocked"><button class="dropdown-item" type="button">Block</button></li>
        <li v-if="isBlocked"><button class="dropdown-item" type="button">Unblock</button></li>
        <li v-if="hasNoRelation"><button class="dropdown-item" type="button">Send Friend Request</button></li>
        <li v-if="isFriend"><button class="dropdown-item" type="button">Unfriend</button></li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { logoutUser } from "@/utils/Login";
import { mapState } from "pinia";
import LoggedOut from "@/components/Authentication/LoggedOut.vue";
import makeApiCall from "@/utils/ApiCall";
import { PublicUser } from "@/types/UserType";
import { useFriendStore } from "@/stores/FriendStore";

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<PublicUser>,
      required: true,
    }
  },
  computed: {
    isBlocked() {
      return true;
    },
    hasNoRelation() {
      return true;
    },
    isFriend() {
      return true;
    },
  },
});
</script>
