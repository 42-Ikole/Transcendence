<template>
    <div>
      <h2>Avatar</h2>
	 	<div class="input-group">
			<input class="form-control form-control-lg"  type="file" @change="handleFileUpload($event)"/>
			<button type="button" class="btn btn-success" @click="submitFile" :disabled="canUploadFile">Save</button>
		</div>
		<p>{{status}}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import { makeApiCall } from "@/utils/ApiCall"
import { Buffer } from 'buffer';

interface DataObject {
	file: any;
	status: string;
}

export default defineComponent({
  data(): DataObject {
    return {
      file: null,
	  status: "",
    }
  },
  computed: {
	  canUploadFile() {
		  return !this.file;
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
		this.status = "Successfully updated avatar!";
	  } else {
		  this.status = "Couldn't update avatar!";
	  }
	  this.file = null;
    },
	  handleFileUpload(event) {
		  console.log("bro?");
		  this.file = event.target.files[0];
	  }
  },
});
</script>
