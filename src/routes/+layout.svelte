<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import { SvelteToast } from '@zerodevx/svelte-toast'
	import '../app.scss';
</script>

<SvelteToast />

<div class="minheight">
	<Header />
	
	<main class="container mt-3">
		<slot />
	</main>
</div>

<footer class="footer p-5 bg-dark text-center text-muted">
	&copy; 2022 Hannes Rüger
</footer>


<style>
	@media screen {
		.minheight {
			min-height: 100vh;
		}
	}
	@media print {
		footer {
			display: none;
		}
		main.container {
			max-width: 100%;
		}
	}
</style>