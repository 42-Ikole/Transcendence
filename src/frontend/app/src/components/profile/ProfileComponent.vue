<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-5">
        <!-- <div class="profileImg" v-bind:class="statusStyling"></div> -->
        <div class="profileImg" v-bind:class="statusStyling" :style="avatar"></div>
        <h2>
          <i class="icon-big"><Trophy /></i> Achievements
        </h2>
        <hr />
        <ul class="text-white">
          <li>Created an account!</li>
        </ul>
      </div>
      <div class="col-md-7">
        <h1>{{ this.profileData.username }}</h1>
        <p class="status" v-bind:class="statusStyling">{{ userStatus }}</p>
        <hr />
        <MatchHistory :userId="userId" />
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
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import type { PublicUser } from "@/types/UserType";
import Trophy from "@/components/icons/IconTrophy.vue";

export default defineComponent({
  props: {
    profileData: {
      type: Object as PropType<PublicUser>,
      required: true,
    },
  },
  computed: {
	userId() {
		return this.profileData.id;
	},
    userName() {
      return this.profileData.username;
    },
    userStatus() {
      return this.profileData.status;
    },
    avatar () {
		return `background-image: url(http://localhost:3000/user/avatar/${this.profileData.id}/1337)`;
	},
    statusStyling() {
      if (this.userStatus === "OFFLINE") {
        return "status-offline";
      } else if (this.userStatus == "PLAYING") {
        return "status-ingame";
      } else {
        return "status-online";
      }
    },
  },
  components: {
    MatchHistory,
    Trophy,
  },
});
</script>
