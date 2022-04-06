<template>
<div>
	<h3>Two Factor Authentication</h3>
	<div v-if="twoFactorEnabled">
			<button class="btn btn-outline-light btn-sm" @click="disableTwoFactor">Disable</button>
	</div>
	<div v-else>
		<div v-if="isPending">
			<img :src="qrcode" />
			<div class="input-group mt-3">
				<span class="input-group-text" id="inputGroupPrepend">Code</span>
				<input type="text" @keyup.enter="updateUsername" v-model="code" id="validationCustomUsername" aria-describedby="inputGroupPrepend" required>
				<button class="btn btn-secondary btn-sm" type="submit" @click="submitTwoFactor">Submit</button>
			</div>
			<div v-if="errorHappened" class="text-warning">
				invalid code
			</div>
		</div>
		<div v-else>
			<button class="btn btn-outline-light btn-sm ms-1" @click="requestTwoFactor">Enable</button>
		</div>
	</div>
</div>
</template>

<script lang="ts">
import { makeApiCall, makeApiCallJson } from "@/utils/ApiCall";
import { useUserStore } from "@/stores/UserStore";
import { defineComponent } from "vue";

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
	emits: ["update"],
	data() {
		return {
			pending: false,
			errorHappened: false,
			qrcode: "",
			code: "",
		};
	},
	computed: {
		twoFactorEnabled() {
			return useUserStore().profileData!.twoFactorEnabled;
		},
		isPending() {
			return this.pending === true;
		},
	},
	methods: {
		async disableTwoFactor() {
			console.log("disabling");
			const response = await makeApiCall("/2fa/disable", { method: "PATCH" });
			if (!response.ok) {
				return;
			}
			this.$emit('update');
		},
		async requestTwoFactor() {
			console.log("requesting");
			const response = await makeApiCall("/2fa/register", { method: "POST" });
			if (!response.body) {
				return;
			}
			const content = await readCompleteStream(response.body);
			this.qrcode = URL.createObjectURL(
				new Blob([content.buffer], { type: "image/png " })
			);
			this.pending = true;
		},
		async submitTwoFactor() {
			console.log("submitting");
			const response = await makeApiCallJson("/2fa/enable", "POST", {
				twoFactorCode: this.code,
			});
			if (!response.ok) {
				this.errorHappened = true;
				return;
			}
			this.pending = false;
			this.$emit('update');
		},
	},
});
</script>