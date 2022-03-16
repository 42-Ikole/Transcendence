<template>
	<div class="conv_creation">
		<h3>Creating a new chat room.</h3>
		<div id="chosing_type">
			<div class="one_elem">
				<input type="radio" value="public" v-model="type" />
				<label for="public">Public</label>
			</div>
			<div class="one_elem">
				<input type="radio" value="private" v-model="type" />
				<label for="private">Private</label>
			</div>
			<div class="one_elem">
				<input type="radio" value="protected" v-model="type" />
				<label for="protected">Protected</label>
			</div>
		</div>
		<div>
			Room name: <input class="input_name" placeholder="Type here" type="text" v-model="name"/>
		</div>
		<div v-if="type === 'protected'">
			Room password: <input class="input_pass" placeholder="Password" type="password" v-model="pass" />
		</div>

		<button v-if="name !== '' && type !== ''" @click="createChat">Create</button>
	</div>

</template>

<script lang="ts">

import { defineComponent } from 'vue';

export default defineComponent({
	data() {
		return {
			type: '',
			name: '',
			pass: ''
		}
	},
	methods: {
		createChat() {
			if (this.name === '' || (this.type === 'protected' && this.pass === '')) {
				console.log('nie goe');
				return ;
			}

			console.log(this.type),
			console.log(this.name),
			console.log(this.pass)
		}
	},
	watch: {
		type(newType, oldType) {
			if (oldType !== 'protected') {
				this.pass = '';
			}
		}
	}

})

</script>

<style scoped>

	.conv_creation {
		width: 300px;
		height: 190px;
		padding: 0px 10px;
		margin: auto;
		border: 2.5px solid #000044;
		text-align: left;
	}

	#chosing_type {
		display: flex;
	}

	.one_elem {
		flex-direction: column;
		margin: 5px 0px;
		margin-right: 15px;
	}

	.input_name {
		margin: 5px 0px;
	}

	.input_pass {
		margin: 5px 0px;
	}

</style>