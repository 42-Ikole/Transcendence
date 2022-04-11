<template>
    <div>
      <h2>Change Avatar</h2>
      <hr/>
	 	<div class="input-group">
			<input class="form-control form-control-lg"  type="file" @change="handleFileUpload($event)" />
			<button type="button" class="btn btn-success" @click="submitFile">Update Avatar</button>
		</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import { makeApiCall } from "@/utils/ApiCall"
import { Buffer } from 'buffer';

export default defineComponent({
  data() {
    return {
      file: "",
    }
  },
  methods: {
    async submitFile() {
      const formData = new FormData();
      console.log(this.file);
      formData.append('file', this.file);
      const response = await makeApiCall("/user/uploadAvatar", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        console.log(response);
		useUserStore().updateAvatar();
      }
    },
	  handleFileUpload(event) {
		  this.file = event.target.files[0];
	  }
  },
});
</script>
