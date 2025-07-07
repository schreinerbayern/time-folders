<script lang="ts">
	import { onMount } from 'svelte';

	let { tabs = [], project = '', activeTab } = $props();

	let scrollContainer: HTMLElement;
	let canScrollLeft = $state(false);
	let canScrollRight = $state(false);

	function updateScrollState() {
		if (!scrollContainer) return;
		const { scrollLeft, scrollWidth, clientWidth } = scrollContainer;
		canScrollLeft = scrollLeft > 0;
		canScrollRight = scrollLeft < scrollWidth - clientWidth - 1;
	}

	function handleScroll(direction: 'left' | 'right') {
		if (!scrollContainer) return;
		const scrollAmount = direction === 'left' ? -250 : 250;
		scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
	}

	$effect(() => {
		// Update scroll state when tabs change
		if (tabs) {
			// Use a timeout to ensure the DOM has updated
			setTimeout(updateScrollState, 50);
		}
	});
</script>

<svelte:window on:resize={updateScrollState} />

<div class="relative flex w-full items-center">
	{#if canScrollLeft}
		<button
			onclick={() => handleScroll('left')}
			class="absolute left-0 z-10 cursor-pointer rounded-full p-1 shadow-md transition-opacity"
			style="background-color: var(--color-primary); color: white;"
			aria-label="Scroll left"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
			</svg>
		</button>
	{/if}

	<div
		class="scrollbar-hide ml-8 w-full overflow-x-auto overflow-y-hidden md:ml-0"
		bind:this={scrollContainer}
		onscroll={updateScrollState}
	>
		<nav class="flex space-x-8" aria-label="Tabs">
			{#each tabs as tab}
				<a href={`/${project}/${tab}`} class="tab-link {activeTab === tab ? 'active' : 'inactive'}">
					{tab}
				</a>
			{/each}
		</nav>
	</div>

	{#if canScrollRight}
		<button
			onclick={() => handleScroll('right')}
			class="absolute right-0 z-10 cursor-pointer rounded-full p-1 shadow-md transition-opacity"
			style="background-color: var(--color-primary); color: white;"
			aria-label="Scroll right"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="h-6 w-6"
				fill="none"
				viewBox="0 0 24 24"
				stroke="currentColor"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
			</svg>
		</button>
	{/if}
</div>
