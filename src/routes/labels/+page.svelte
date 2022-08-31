<script lang="ts">
	import Barcode from 'svelte-barcode';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/labels/$types';

	// export let data: PageData;

	const config = {
		format: 'CODE128',
		width: 3,
		height: 50,
		text: "",
		textAlign: 'center',
		textPosition: 'bottom',
		textMargin: 2,
		fontSize: 20,
		background: '#ffffff',
		lineColor: '#000000',
		margin: 30,
	}
</script>

<svelte:head>
	<title>Labels</title>
</svelte:head>

<style>
	@media print {
		.main * {
			display: none;
		}
		#printable {
			display: block;
		}
	}
</style>

<div class="main">
	<h1>Labels</h1>
	
	<div class="d-flex justify-content-between mb-5">
		<div class="d-flex">
			<div class="form-group">
				<label for="width">Width</label>
				<input type="number" class="form-control" id="width" placeholder="Width" bind:value={config.width}>
			</div>
			<div class="form-group">
				<label for="height">Height</label>
				<input type="number" class="form-control" id="height" placeholder="Height" bind:value={config.height}>
			</div>
			<div class="form-group">
				<label for="margin">Margin</label>
				<input type="number" class="form-control" id="margin" placeholder="Margin" bind:value={config.margin}>
			</div>
		</div>
		<button class="btn btn-outline-primary" on:click={() => window.print()}>Print</button>
	</div>

	<div id="printable">
		<h1>Labels 1 - 100</h1>
		{#each Array(100) as _, index (index)}
			<Barcode
				value={100000 + index}
				elementTag={'canvas'}
				options={config}
			/>
		{/each}
	</div>
</div>
