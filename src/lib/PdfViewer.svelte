<script lang="ts">
	let { project, tab, file, onsave } = $props();

	let viewerUrl = $derived(`/pdfjs/web/viewer.html?file=/${project}/${tab}`);

	$effect(() => {
		console.log('Effect running in PdfViewer.svelte. Adding event listener.', viewerUrl);
		const handleMessage = (event: MessageEvent) => {
			console.log('Received message in PdfViewer.svelte:', event.data);
			if (event.data && event.data.type === 'pdf-save') {
				const { pdfData } = event.data;
				if (onsave) {
					onsave({ detail: { pdfData, project, tab, file } });
				}
			}
		};

		window.addEventListener('message', handleMessage);

		return () => {
			console.log('Effect cleanup in PdfViewer.svelte. Removing event listener.');
			window.removeEventListener('message', handleMessage);
		};
	});
</script>

<div class="h-full w-full">
	{#if viewerUrl}
		<iframe src={viewerUrl} class="h-full w-full" title="PDF Viewer"></iframe>
	{:else}
		<p>Loading PDF...</p>
	{/if}
</div>
