<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-5">
        <div
          class="profileImg"
          v-bind:class="statusStyling"
          :style="avatar"
        ></div>
        <AchievementList :userId="userId" />
      </div>
      <div class="col-md-7">
	  	<div class="row align-items-center">
		  	<div class="col-md-auto">
				<h1>{{ profileData.username }}</h1>
			</div>
			<div class="col	">
				<ChatUserDropdown :user="profileData" :showChatOptions="false" />
			</div>
		</div>
        <p class="status" v-bind:class="statusStyling">{{ userStatus }}</p>
        <p class="text-white">Game Wins: {{ matchStats.winCount }}</p>
        <p class="text-white">Game Losses: {{ matchStats.lossCount }}</p>
        <p class="text-white">Matchmaking Rating: {{ matchStats.rating }}</p>
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
import MatchHistory from "@/components/profile/MatchHistory.vue";
import type { PublicUser } from "@/types/UserType";
import { makeAvatarUrl } from "@/stores/UserStore";
import makeApiCall from "@/utils/ApiCall";
import AchievementList from "./AchievementList.vue";
import ChatUserDropdown from "../ChatDropdown/ChatUserDropdown.vue";

interface MatchStats {
  winCount: number;
  lossCount: number;
  rating: number;
}

interface DataObject {
  matchStats: MatchStats;
}

export default defineComponent({
  props: {
    profileData: {
      type: Object as PropType<PublicUser>,
      required: true,
    },
  },
  data(): DataObject {
    return {
      matchStats: { winCount: 0, lossCount: 0, rating: 0 },
    };
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
    avatar() {
      const url = makeAvatarUrl(this.profileData.id);
      return `background-image: url(${url})`;
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
    AchievementList,
    ChatUserDropdown,
  },
  async mounted() {
    const response = await makeApiCall(`/match/stats/${this.userId}`);
    this.matchStats = await response.json();
  },
});
</script>
