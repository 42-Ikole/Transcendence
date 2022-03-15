<template>
  <div v-if="isDisabled">
    <button @click="register">Enable Two Factor</button>
  </div>
  <div v-else-if="isPending">
    <img :src="qrcode" />
    <input v-model="code" placeholder="enter code" />
    <button @click="submit">Submit Code</button>
  </div>
  <div>
    <button @click="disable">Disable Two Factor</button>
  </div>
</template>

<script lang="ts">
import makeApiCall from "@/utils/ApiCall";
import { defineComponent } from "vue";

enum TwoFactorState {
  PENDING,
  ENABLED,
  DISABLED,
}

async function readCompleteStream(
  body: ReadableStream<Uint8Array>
): Promise<Uint8Array> {
  const reader = body.getReader();
  let content = new Uint8Array(0);
  let chunk;
  do {
    chunk = await reader.read();
    if (chunk.value) {
      content = new Uint8Array([...content, ...chunk.value]);
    }
  } while (!chunk.done);
  return content;
}

export default defineComponent({
  data() {
    return {
      state: TwoFactorState.DISABLED,
      qrcode: "",
      code: "",
    };
  },
  computed: {
    isDisabled() {
      return this.state === TwoFactorState.DISABLED;
    },
    isPending() {
      return this.state === TwoFactorState.PENDING;
    },
  },
  methods: {
    async register() {
      const response = await makeApiCall("/2fa/register", { method: "POST" });
      if (!response.body) {
        return;
      }
      const content = await readCompleteStream(response.body);
      this.qrcode = URL.createObjectURL(
        new Blob([content.buffer], { type: "image/png " })
      );
      this.state = TwoFactorState.PENDING;
    },
    async submit() {
      const response = await makeApiCall("/2fa/enable", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ twoFactorCode: this.code }),
      });
      if (response.ok) {
        this.state = TwoFactorState.ENABLED;
      }
    },
    async disable() {
      const response = makeApiCall("/2fa/disable", { method: "PATCH" });
      this.state = TwoFactorState.DISABLED;
    },
  },
});
</script>
