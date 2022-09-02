<script lang="ts">
	import type { PageData } from '../../../.svelte-kit/types/src/routes/scan/$types';
	import ScanModal from '$lib/ScanModal.svelte';
	import type { Location } from '@prisma/client';
	import { request } from '$lib/request';
	import { success } from '$lib/toasts';

	export let data: PageData;

	let scanModal: ScanModal;

	let mode: "checkin" | "checkout" | undefined;

	let location: Location | undefined;

	function startScanning() {
		scanModal.start();
	}

	async function onScanResult({detail}: CustomEvent) {
		await request("PATCH", "/scan", {
			label: detail,
            status: mode === "checkin" ? "AVAILABLE" : "USED",
			locationId: location?.id,
        });
		success(`Item ${mode === "checkin" ? "checked in" : "checked out"}`);
		scanModal.savedResume();
	}
</script>

<svelte:head>
	<title>Scan</title>
</svelte:head>

<div>
	<div class="d-flex justify-content-between mb-3">
		<h1>Scan Labels</h1>
		{#if mode !== undefined && location }
			<button class="btn btn-outline-primary" on:click={() => startScanning()}>Go</button>
		{/if}
	</div>
	<div class="row row-cols-1 row-cols-md-3 g-4">
		{#if mode === undefined}
			<div class="col"><div class="card card-clickable cursor-pointer" on:click={() => mode = "checkin"}><div class="card-body"><h5 class="card-title">Checkin</h5></div></div></div>
			<div class="col"><div class="card card-clickable cursor-pointer" on:click={() => mode = "checkout"}><div class="card-body"><h5 class="card-title">Checkout</h5></div></div></div>
		{:else}
			{#each data.locations as l (l.id)}
			<div class="col">
				<!-- svelte-ignore a11y-label-has-associated-control -->
				<label class="card text-bg-{l.color}">
					<div class="card-body">
						<h5>{l.name}</h5>
						<input type=radio bind:group={location} name="location" value={l}>
					</div>
				</label>
			</div>
			{/each}
		{/if}
	</div>
	{#if mode !== undefined}
		<button class="mt-3 btn btn-outline-secondary" on:click={() => mode = undefined}>Back</button>
	{/if}
</div>

<ScanModal bind:this={scanModal} on:scanResult={onScanResult}>
	{mode ? {checkin: "Checkin", checkout: "Checkout"}[mode] : ""} to {location?.name}
</ScanModal>