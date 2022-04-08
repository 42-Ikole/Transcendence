<template>
  <form method="post" action="http://localhost:3000/user/uploadAvatar" enctype="multipart/form-data">
    <div>
      <label for="file">Choose a file</label>
      <input type="file" id="file" name="myFile">
    </div>
    <div>
      <button type="submit">Submit</button>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "pinia";
import { useUserStore } from "@/stores/UserStore";
import MatchHistory from "@/components/profile/MatchHistory.vue";
import { makeApiCallJson } from "@/utils/ApiCall"
import { Buffer } from 'buffer';

export default defineComponent({
  methods: {
    async uploadAvatar(filename: string, imageData: string) {
      const avatar = {
        filename: filename,
        raw: Buffer.from(imageData, 'utf-8'),
      };
      await makeApiCallJson("/user/uploadAvatar", "POST", avatar);
    },
	  updateAvatar(event) {
		  const file = event.target.files[0];
      const reader = new FileReader();
		  reader.readAsBinaryString(file);
		  reader.onloadend = () => {
        // upload file -> reader.result
        this.uploadAvatar(file.name, reader.result);
		  }
	  }
  },
});
</script>
