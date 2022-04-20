<template>
  <div class="container py-5">
    <form
      class="card-header justify-content-between align-items-center p-3"
      style="width: 45%; background-color: #eee"
      @submit.prevent="createChat"
    >
      <div class="d-flex justify-content-between align-items-center p-2">
        <h4>Creating a new chat room.</h4>
        <div class="btn btn-sm" role="group">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            data-mdb-ripple-color="dark"
            style="line-height: 1"
            @click="switchToRoomList"
          >
            Back
          </button>
        </div>
      </div>
      <div class="card card-body">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            value="public"
            v-model="type"
          />
          <label class="form-check-label" for="public">Public</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            value="private"
            v-model="type"
          />
          <label class="form-check-label" for="private">Private</label>
        </div>
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            value="protected"
            v-model="type"
          />
          <label class="form-check-label" for="protected">Protected</label>
        </div>
      </div>
      <div class="card-header justify-content-between">
        <p class="text-primary fs-6 fst-italic">
          Valid characters are A-Z a-z 0-9 _ (can't begin with _ )
        </p>
        Room name:
        <input
          class="card-title col-8"
          placeholder="Maximum length of 20"
          maxlength="20"
          type="text"
          v-model="name"
        />
        <div v-if="type === 'protected'">
          Room password:
          <input
            class="card-title"
            style="margin: 0px 8px"
            placeholder="Password"
            :type="passwordVisibility"
            v-model="pass"
          />
          <button type="button" @click="toggleShowPassword">
            <i v-if="showPassword">
              <EyeOpen />
            </i>
            <i v-else>
              <EyeClosed />
            </i>
          </button>
        </div>
        <div
          class="text-danger"
          style="padding-bottom: 5px"
          v-if="errorMessage !== ''"
        >
          {{ errorMessage }}
        </div>
        <div>
          <input
            class="btn btn-success"
            style="line-height: 1"
            v-bind:disabled="invalidRoomInput === true"
            type="submit"
            value="Create"
          />
        </div>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { makeApiCallJson } from "@/utils/ApiCall";
import EyeOpen from "../icons/IconEyeOpen.vue";
import EyeClosed from "../icons/IconEyeClosed.vue";

interface DataObject {
  type: string;
  name: string;
  pass: string;
  showPassword: boolean;
  errorMessage: string;
}

export default defineComponent({
  emits: ["roomCreated"],
  data(): DataObject {
    return {
      type: "",
      name: "",
      pass: "",
      showPassword: false,
      errorMessage: "",
    };
  },
  methods: {
    async createChat() {
      if (this.name === "" || (this.type === "protected" && this.pass === "")) {
        return;
      }
      const response = await makeApiCallJson("/chat", "POST", {
        type: this.type,
        name: this.name,
        password: this.pass,
      });
      this.pass = "";
      console.log(response);
      if (response.ok) {
        this.$emit("roomCreated");
      } else {
        if (response.status === 406) {
          this.errorMessage = "Invalid room name!";
        } else if (response.status === 409) {
          this.errorMessage = "Room name already exists!";
        } else if (response.status === 418) {
          this.errorMessage = "I'm a teapot";
        }
      }
    },
    toggleShowPassword() {
      this.showPassword = !this.showPassword;
    },
    switchToRoomList() {
      this.$emit("roomCreated");
    },
  },
  watch: {
    type(newType, oldType) {
      if (oldType !== "protected") {
        this.pass = "";
      }
      if (oldType !== newType) {
        this.errorMessage = "";
      }
    },
    name(newName, oldName) {
      if (oldName !== newName) {
        this.errorMessage = "";
      }
    },
  },
  computed: {
    invalidRoomInput() {
      if (
        this.type === "" ||
        this.name === "" ||
        (this.type === "protected" && this.pass === "")
      ) {
        return true;
      }
      return false;
    },
    passwordVisibility() {
      return this.showPassword ? "text" : "password";
    },
  },
  components: {
    EyeOpen,
    EyeClosed,
  },
});
</script>
