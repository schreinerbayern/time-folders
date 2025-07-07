<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form } = $props<ActionData>();
</script>

<style>
	.login-button {
		background-color: var(--color-primary);
	}
	.login-button:hover {
		background-color: var(--color-primary-hover);
	}
</style>

<div class="flex items-center justify-center h-screen" style="background-color: var(--color-drawer-background);">
	<div class="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
		<img src="/logo/logo.svg" alt="Logo" class="w-full h-auto mb-4" />
		<h1 class="text-2xl font-bold text-center text-text-active">Login</h1>
		<form method="POST" use:enhance class="space-y-6">
			<div>
				<label for="name" class="block mb-2 text-sm font-medium text-text-inactive">Name</label>
				<input
					type="text"
					name="name"
					id="name"
					class="w-full px-3 py-2 border rounded-lg border-border focus:outline-none focus:ring focus:ring-primary-hover"
					required
				/>
			</div>
			<div>
				<label for="password" class="block mb-2 text-sm font-medium text-text-inactive"
					>Password</label
				>
				<input
					type="password"
					name="password"
					id="password"
					class="w-full px-3 py-2 border rounded-lg border-border focus:outline-none focus:ring focus:ring-primary-hover"
					required
				/>
			</div>
			{#if form?.error}
				<p class="text-red-500 text-sm">{form.error}</p>
			{/if}
			<div>
				<button
					type="submit"
					class="w-full px-4 py-2 text-white rounded-lg login-button focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
				>
					Kommt
				</button>
			</div>
		</form>
	</div>
</div>
