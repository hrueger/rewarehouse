<script lang="ts">
	import Header from '$lib/header/Header.svelte';
	import '../app.scss';
</script>

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
	.minheight {
		min-height: 100vh;
	}
</style>