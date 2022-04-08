<template>
  <div class="container">
    <div>
      <h2>Single File</h2>
      <hr/>
      <label>File
        <input type="file" @change="handleFileUpload($event)"/>
      </label>
      <br>
      <button @click="submitFile">Submit</button>
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
      }
    },
	  handleFileUpload(event) {
		  this.file = event.target.files[0];
	  }
  },
});
</script>
