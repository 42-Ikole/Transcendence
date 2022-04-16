<template>
  <div>
    <h2>Avatar</h2>
    <div class="input-group">
      <input
        class="form-control form-control-lg"
        type="file"
        accept="image/*"
        @change="handleFileUpload($event)"
      />
      <button
        type="button"
        class="btn btn-success"
        @click="submitFile"
        :disabled="canUploadFile"
      >
        Save
      </button>
    </div>
    <p>{{ status }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useUserStore } from "@/stores/UserStore";
import { makeApiCall } from "@/utils/ApiCall";

interface DataObject {
  file: any;
  status: string;
}

const MAX_FILE_SIZE = 1024 * 1024 * 10

export default defineComponent({
  data(): DataObject {
    return {
      file: null,
      status: "",
    };
  },
  computed: {
    canUploadFile() {
      return !this.file;
    },
  },
  methods: {
    async submitFile() {
      const formData = new FormData();
      formData.append("file", this.file);
      const response = await makeApiCall("/user/uploadAvatar", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        useUserStore().updateAvatar();
        this.status = "Successfully updated avatar!";
      } else {
      this.status = "Couldn't update avatar!";
      }
      this.file = null;
    },
    handleFileUpload(event: any) {
      this.file = event.target.files[0];
      this.status = "";
      this.validateFile();
    },
    validateFile() {
      if (!this.file.type || !this.isImage()) {
        this.handleError('Invalid file type!');
        return;
      }
      if (this.file.size > MAX_FILE_SIZE) {
        const MB_SIZE = MAX_FILE_SIZE / 1024 / 1024;
        this.handleError(`File too large! Max Size: ${MB_SIZE} MB`);
      }
    },
    isImage() {
      return this.file.type.startsWith('image/');
    },
    handleError(status: string) {
      this.status = status;
      this.file = null;
    },
  },
});
</script>
