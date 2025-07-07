<script lang="ts">
	import '../app.css';
	import Drawer from '$lib/Drawer.svelte';
	import { PUBLIC_LOGO_URL } from '$env/static/public';

	let { data, children } = $props();
	const logoUrl = PUBLIC_LOGO_URL || '';
	const activeProject = $derived(data.project);

	let isDrawerOpen = $state(false);

	function toggleDrawer() {
		isDrawerOpen = !isDrawerOpen;
	}
</script>

<div class="flex h-screen">
	{#if data.user}
		<div class="md:hidden fixed top-0 left-0 z-50 p-4">
			<button onclick={toggleDrawer} class="p-2 rounded-md bg-gray-200">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
		<Drawer {logoUrl} projects={data.projects} {activeProject} user={data.user} bind:isDrawerOpen={isDrawerOpen} />
	{/if}
	<main class="flex flex-1 flex-col overflow-y-auto px-8 transition-all duration-300 ease-in-out {isDrawerOpen ? 'ml-48' : 'ml-0'}">
		{@render children()}
	</main>
</div>
