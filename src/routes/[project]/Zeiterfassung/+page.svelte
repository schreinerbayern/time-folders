<script lang="ts">
	let { data } = $props();

	function formatDateTime(isoString: string): string {
		const date = new Date(isoString);
		const optionsDate: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
		const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

		const formattedDate = date.toLocaleDateString(undefined, optionsDate);
		const formattedTime = date.toLocaleTimeString(undefined, optionsTime);

		return `${formattedDate}<br/>${formattedTime}`;
	}
</script>

<div class="time-entries-container">
	<h1 class="time-entries-header">Zeiterfassung</h1>

	{#if data.timeEntries && data.timeEntries.length > 0}
		<div class="time-entries-table-wrapper">
			<table class="time-entries-table">
				<thead>
					<tr>
						{#each Object.keys(data.timeEntries[0]) as header}
							<th class="time-entries-table-th">
								{header}
							</th>
						{/each}
					</tr>
				</thead>
				<tbody>
					{#each data.timeEntries as entry}
						<tr>
							{#each Object.entries(entry) as [key, value]}
								<td class="time-entries-table-td">
									{#if (key === 'Start' || key === 'Ende') && typeof value === 'string'}
										{@html formatDateTime(value)}
									{:else}
										{value}
									{/if}
								</td>
							{/each}
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{:else}
		<p class="time-entries-empty">Keine Einträge gefunden.</p>
	{/if}
</div>
