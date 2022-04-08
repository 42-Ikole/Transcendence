<template>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-5">
        <div class="profileImg" v-bind:class="statusStyling"></div>
		<!-- blub !-->
		<form>
			<input type="file" class="form-control" id="customFile" v-on:change="updateAvatar($event)" />
		</form>

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

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";

export default defineComponent({
	data() {
    return {
      avatar: null,
    };
  },
  computed: {
    ...mapState(useUserStore, ["profileData", "state"]),
    userName() {
      return this.profileData.username;
    },
    userStatus() {
      return this.state;
    },
    statusStyling() {
      if (this.state === "ONLINE") return "status-online";
      else if (this.state == "PLAYING") return "status-ingame";
      else return "status-offline";
    },
  },
  methods: {
	  async updateAvatar(event) {
		  const file = event.target.files[0];
		  const reader = new FileReader();
		  reader.readAsBinaryString(file);
		  reader.onloadend = function(){
			  // upload file -> reader.result
		  }
	  }
  },
  components: {
    MatchHistory,
  },
});
</script>

<style>
.profileImg {
  background: #f0f0f0 url("@/assets/profileplaceholder.jpeg");
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
