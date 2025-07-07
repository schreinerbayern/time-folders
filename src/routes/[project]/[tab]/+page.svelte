<script lang="ts">
	import PdfViewer from '$lib/PdfViewer.svelte';
	import { activeTimers } from '$lib/stores/timeTrackingStore';
	import { enhance } from '$app/forms';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	let csvContent = $derived(data.csvContent as Record<string, string[]> | undefined);

	function handleSave(
		event: CustomEvent<{ pdfData: string; project: string; tab: string; file: string }>
	) {
		const { pdfData, project, tab, file } = event.detail;

		fetch(`/${project}/${tab}?file=${encodeURIComponent(file)}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ pdfData })
		})
			.then((response) => response.json())
			.then((data) => {
				console.log('Server response:', data);
				alert('PDF erfolgreich gespeichert!');
			})
			.catch((error) => {
				console.error('Error sending PDF to server:', error);
				alert('Fehler beim Speichern!');
			});
	}

	async function startTracking(newKostenstellenNummer: string, newKostenstellenText: string) {
		// Check if there's an active timer
		const currentActiveTimerEntry = Array.from($activeTimers.entries())[0];

		if (currentActiveTimerEntry) {
			const [oldKostenstellenNummer, oldTimerData] = currentActiveTimerEntry;
			const oldProjectNumber = oldTimerData.project.split('_')[0];
			const oldStartTime = oldTimerData.startTime;
			const oldEndTime = new Date().toISOString();

			// Prepare FormData for the old timer's "Stop" action
			const formData = new FormData();
			formData.append('userName', data.user.name);
			formData.append('projectNumber', oldProjectNumber);
			formData.append('kostenstellenNummer', oldKostenstellenNummer);
			formData.append('startTime', oldStartTime);
			formData.append('endTime', oldEndTime);

			try {
				const response = await fetch(`${data.pathname}?/trackTime`, {
					method: 'POST',
					body: formData,
					headers: {
						'x-sveltekit-action': 'true'
					}
				});

				if (response.ok) {
					console.log('Previous timer stopped successfully.');
					activeTimers.update((map) => {
						map.delete(oldKostenstellenNummer);
						return map;
					});
				} else {
					console.error('Failed to stop previous timer.');
					// Optionally, handle error: maybe don't start new timer if old one failed to stop
				}
			} catch (error) {
				console.error('Error stopping previous timer:', error);
				// Optionally, handle error
			}
		}

		// Now, start the new timer
		activeTimers.update((map) => {
			map.set(newKostenstellenNummer, {
				startTime: new Date().toISOString(),
				text: newKostenstellenText,
				project: data.project,
				url: data.pathname
			});
			return map;
		});
	}
</script>

<div class="flex h-full flex-col md:flex-row">
	<div class="min-h-1/2 flex w-full flex-col md:w-2/3">
		{#if data.noPdfFound}
			<p>Keine PDF-Dokumente in diesem Tab vorhanden.</p>
		{:else if data.file}
			<div class="flex-1">
				<PdfViewer file={data.file} project={data.project} tab={data.tab} onsave={handleSave} />
			</div>
		{:else}
			<p>Select a file to view.</p>
		{/if}
	</div>

	{#if csvContent && Object.keys(csvContent).length > 0}
		<div class="kostenstellen-container min-h-0 w-full overflow-y-auto md:w-1/3">
			<h2>Kostenstellen:</h2>
			{#each Object.entries(csvContent) as [fileName, entries]}
				<ul class="kostenstellen-list">
					{#each entries as entry}
						{@const kostenstellenNummer = entry.split(',')[0]}
						<li class="kostenstellen-list-item">
							<div class="flex flex-col">
								<span class="kostenstellen-caption">{kostenstellenNummer}</span>
								{#if entry.split(',').length > 1}
									<span class="kostenstellen-subtext"
										>{entry.split(',').slice(1).join(',').trim()}</span
									>
								{/if}
							</div>
							{#if $activeTimers.has(kostenstellenNummer)}
								{@const timerData = $activeTimers.get(kostenstellenNummer)}
								<form
									method="POST"
									action="?/trackTime"
									use:enhance={({ formData }) => {
										formData.append('endTime', new Date().toISOString());
										return async ({ result }) => {
											if (result.type === 'success') {
												activeTimers.update((map) => {
													map.delete(kostenstellenNummer);
													return map;
												});
											}
										};
									}}
								>
									<input type="hidden" name="userName" value={data.user.name} />
									<input
										type="hidden"
										name="projectNumber"
										value={timerData ? timerData.project.split('_')[0] : ''}
									/>
									<input type="hidden" name="kostenstellenNummer" value={kostenstellenNummer} />
									<input type="hidden" name="startTime" value={timerData?.startTime || ''} />
									<button type="submit" class="kostenstellen-button">Stop</button>
								</form>
							{:else}
								<button
									class="kostenstellen-button"
									onclick={() =>
										startTracking(kostenstellenNummer, entry.split(',').slice(1).join(',').trim())}
									>Start</button
								>
							{/if}
						</li>
					{/each}
				</ul>
			{/each}
		</div>
	{/if}
</div>
