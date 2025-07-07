<script lang="ts">
	import Tabs from '$lib/Tabs.svelte';
	let { children, data } = $props();

	const activeTab = $derived(data.tab);
</script>

{#if data.zeitwirtschaftMissing}
	<div class="p-4">
		<h1 class="text-xl font-bold">Zeitwirtschaft nicht eingerichtet</h1>
		<p>Für dieses Projekt wurde noch keine Zeitwirtschaft eingerichtet.</p>
	</div>
{:else}
	<Tabs tabs={data.subfolders} project={data.project} activeTab={activeTab} />

	{@render children()}
{/if}
