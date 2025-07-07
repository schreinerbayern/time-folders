<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		if (typeof window !== 'undefined') {
			localStorage.removeItem('active_timer');
		}
		goto('/');
	});
</script>