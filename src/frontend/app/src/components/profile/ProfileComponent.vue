<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-5">
        <!-- <div class="profileImg" v-bind:class="statusStyling"></div> -->
        <img class="profileImg" v-bind:class="statusStyling" :src="avatar">
      </div>
      <div class="col-md-7">
        <h1>{{ userName }}</h1>
        <p class="status" v-bind:class="statusStyling">{{ userStatus }}</p>
        <hr />
        <MatchHistory />
      </div>
    </div>
  </div>
</template>

<style>
.profileImg {
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 50%;
  height: 400px;
  width: 400px;
  border: solid;
  border-width: 3px;
}

.status-offline {
  border-color: #000000;
  color: #000000;
}
.status-online {
  border-color: #25af2df3;
  color: #25af2df3;
}
.status-ingame {
  border-color: #ff8e00;
  color: #ff8e00;
}

.status {
  margin-top: -3px;
  font-size: 12px;
}
</style>

<script lang="ts">
import { defineComponent, type PropType } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import type { PublicUser } from "@/types/UserType";
import { useUserStore } from "@/stores/UserStore";

export default defineComponent({
  props: {
      profileData: {
        type: Object as PropType<PublicUser>,
        required: true,
      },
  },
  computed: {
    userName() {
      return this.profileData.username;
    },
    userStatus() {
      return this.profileData.status;
    },
    avatar() {
      return useUserStore().avatarUrl;
    },
    statusStyling() {
      if (this.userStatus === "OFFLINE") {
        return "status-offline";
      }
      else if (this.userStatus == "PLAYING") {
        return "status-ingame";
      } else {
        return "status-online";
      }
    },
  },
  components: {
    MatchHistory,
  },
});
</script>
