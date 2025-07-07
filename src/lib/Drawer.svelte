<script lang="ts">
	import { activeTimers, type TimerData } from '$lib/stores/timeTrackingStore';
	import { onMount, onDestroy } from 'svelte';
	import { enhance } from '$app/forms';

	let { logoUrl = '', projects = [], activeProject, user, isDrawerOpen = $bindable() } = $props();

	let activeTimer = $state<[string, TimerData] | undefined>(undefined);
	let runningTime = $state<string>('00:00:00');

	activeTimers.subscribe((map) => {
		if (map.size > 0) {
			// Assuming only one timer can be active at a time
			activeTimer = Array.from(map.entries())[0];
		} else {
			activeTimer = undefined;
			runningTime = '00:00:00';
		}
	});

	let interval: NodeJS.Timeout;

	onMount(() => {
		interval = setInterval(() => {
			if (activeTimer) {
				const [kostenstelle, { startTime, text: kostenstelleText }] = activeTimer;
				const start = new Date(startTime).getTime();
				const now = new Date().getTime();
				const durationMs = now - start;

				const hours = Math.floor(durationMs / (1000 * 60 * 60));
				const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((durationMs % (1000 * 60)) / 1000);

				runningTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
			}
		}, 1000);
	});

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div
	class="drawer fixed flex h-full w-64 -translate-x-full transform flex-col p-4 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 {isDrawerOpen
		? 'translate-x-0'
		: ''}"
>
	<div class="flex justify-end md:hidden">
		<button onclick={() => (isDrawerOpen = false)} class="rounded-md bg-gray-200 p-2">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
			</svg>
		</button>
	</div>
	<img src={logoUrl} alt="Logo" class="max-h-[5rem] object-contain" />
	<ul class="my-2">
		<li>
			<a
				href="/"
				onclick={() => (isDrawerOpen = false)}
				class="drawer-link block rounded p-2 {!activeProject ? 'active' : ''}"
			>
				<span>Übersicht</span>
			</a>
		</li>
	</ul>
	<h2 class="mx-2 text-lg font-bold">Projekte</h2>
	<ul class="flex-grow overflow-y-auto">
		{#each projects as project}
			<li>
				<a
					href="/{project}"
					class="drawer-link flex flex-col rounded p-2 {activeProject === project ? 'active' : ''}"
					onclick={() => (isDrawerOpen = false)}
				>
					<span>{project.split('_')[0]}</span>
					<span class="text-sm text-gray-500">{project.split('_').slice(1).join('_')}</span>
				</a>
			</li>
		{/each}
	</ul>
	<div class="mb-4 rounded-lg bg-white p-4 shadow-sm">
		<h3 class="mb-2 text-sm font-bold">Angemeldet als:</h3>
		<div class="flex items-center justify-between">
			<span class="font-bold">{user.name}</span>
			<form
				method="POST"
				action="/logout"
				use:enhance={() => {
					return async ({ result }) => {
						if (result.type === 'redirect') {
							activeTimers.set(new Map());
							window.location.href = result.location;
						}
					};
				}}
			>
				{#if activeTimer}
					<input type="hidden" name="activeTimer" value={JSON.stringify(activeTimer)} />
				{/if}
				<button type="submit" class="kostenstellen-button">Geht</button>
			</form>
		</div>

		{#if activeTimer}
			<hr class="my-2 border-t border-[var(--color-border)]" />
			<h3 class="mb-2 text-sm font-bold">Aktuelle Aufgabe:</h3>
			<div class="flex flex-col">
				<div class="flex items-center justify-between">
					{#if activeTimer[1].url}
						{@const [kostenstelle, timerData] = activeTimer}
						{@const display = timerData.project
							? `${timerData.project.split('_')[0]}|${kostenstelle}`
							: kostenstelle}
						<a
							href={activeTimer[1].url}
							onclick={() => (isDrawerOpen = false)}
							class="active-task-link text-sm font-bold"
						>
							{display}
						</a>
					{:else}
						{@const [kostenstelle, timerData] = activeTimer}
						{@const display = timerData.project
							? `${timerData.project.split('_')[0]}|${kostenstelle}`
							: kostenstelle}
						<span class="text-sm font-bold">
							{display}
						</span>
					{/if}
					<span class="font-mono text-sm">{runningTime}</span>
				</div>
				<span class="text-sm text-gray-500">{activeTimer[1].text}</span>
			</div>
		{/if}
	</div>
</div>
