<script lang="ts">
	import { enhance } from '$lib/form';
	import { formatLength } from '$lib/helpers';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/items/$types';
	import ScanModal from '$lib/ScanModal.svelte';
	import { request } from '$lib/request';
	import { invalidate } from '$app/navigation';
	import { STATUS } from '$lib/constants/Status';

	export let data: PageData;

	let scanModal: ScanModal;

	type Itm = typeof data.items[0];

	let currentItem: Itm;

	function scanAndBindLabel(item: Itm) {
		currentItem = item;
		scanModal.start();
	}

	async function onScanResult({detail}: CustomEvent) {
		await request("PATCH", "/items", {
            code: detail,
            id: currentItem.id,
        });
		await invalidate();
		currentItem = data.items[data.items.findIndex((i) => i.id === currentItem.id) + 1];
		if (currentItem) {
			scanModal.savedResume();
		} else {
			await scanModal.stop();
		}
	}
</script>

<svelte:head>
	<title>Items</title>
</svelte:head>

<div>
	<h1>Items</h1>
	<div class="table-responsive">
		<table class="table table-sm">
			<thead>
				<tr>
					<th>Category</th>
					<th>Manufacturer</th>
					<th>Name</th>
					<th>Lenth / Size</th>
					<th>Location</th>
					<th>Label</th>
					<th>Status</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.items as item (item.id)}
					<tr>
						<td>{item.product.category.name}</td>
						<td>{item.product.manufacturer}</td>
						<td>{item.product.name}</td>
						<td>{formatLength(item.product.length)}</td>
						<td class="table-{item.currentLocation.color}">{item.currentLocation.name}</td>
						<td>{item.label?.code || ""}</td>
						<td class="table-{STATUS[item.status]?.color}">{STATUS[item.status]?.name}</td>
						<td class="d-flex gap-1">
							<button class="btn btn-outline-warning" on:click={() => scanAndBindLabel(item)}>
								<i class="fas fa-barcode"></i>
							</button>
							<form
							action="/items?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (item._pendingDelete = true)
							}}
						>
							<input type="hidden" name="id" value={item.id} />
							<button class="btn btn-outline-danger" disabled={item._pendingDelete}>
								{#if item._pendingDelete}
									<i class="spinner-border spinner-border-sm"></i>
								{:else}
									<i class="fas fa-trash"></i>
								{/if}
							</button>
						</form>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<ScanModal bind:this={scanModal} on:scanResult={onScanResult}>
	Label for <i>{currentItem?.product.name}</i><br><small>({currentItem?.product.manufacturer})</small>
</ScanModal>