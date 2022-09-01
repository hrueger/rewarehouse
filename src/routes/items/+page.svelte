<script lang="ts">
	import { enhance } from '$lib/form';
	import { formatLength } from '$lib/helpers';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/items/$types';
    import { Html5Qrcode } from 'html5-qrcode'
    import { onMount } from 'svelte'
	import type { Item } from '@prisma/client';
	import { invalidate } from '$app/navigation';
	import { error } from '$lib/toasts';

	export let data: PageData;

    let html5Qrcode: Html5Qrcode;
	let showScanModal = false;
	let scanStatus: "scanning" | "saving" = "scanning";
	let currentItem: Item & { [key: string]: any };
	let scannedLabels = new Set<string>();

    onMount(() => {
		html5Qrcode = new Html5Qrcode('reader')
	});

    function start() {
        html5Qrcode.start(
            { facingMode: 'environment' },
            {
                fps: 10,
                qrbox: { width: 250, height: 100 },
            },
            onScanSuccess,
			() => undefined,
        )
    }

    async function stop() {
        await html5Qrcode.stop()
    }

    async function onScanSuccess(decodedText: string, decodedResult: unknown) {
		if (scannedLabels.has(decodedText)) {
			return;
		}
		scannedLabels.add(decodedText);
		scanStatus = "saving";
		await fetch("/items?_method=PATCH", {
			method: "POST",
			headers: {
				"Accept": "application/json",
			},
			body: toFormData({
				code: decodedText,
				id: currentItem.id,
			}),
		}).then(async (res) => {
			if (res.ok) {
				return;
			} else {
				throw new Error((await res.json()).message);
			}
		}).catch((m) => {
			error(m.toString());
		});
		await invalidate();
		currentItem = data.items[data.items.findIndex((i) => i.id === currentItem.id) + 1];
		if (currentItem) {
			scanStatus = "scanning";
		} else {
			await stop();
			showScanModal = false;
		}
    }

	const STATUS = {
		AVAILABLE: { name: "Available", color: "success" },
		LENT: { name: "Lent", color: "warning" },
		USED: { name: "Used", color: "primary" }
	}

	async function scanAndBindLabel(item: Item) {
		showScanModal = true;
		currentItem = item;
		start();
		scanStatus = "scanning";
	}

	async function closeScanModal() {
		scanStatus = "saving";
		await stop();
		showScanModal = false;
		scannedLabels = new Set();

	}

	// convert object to form data
	function toFormData(obj: Record<string, any>) {
		const formData = new FormData();
		for (const [k, v] of Object.entries(obj)) {
			formData.append(k, v);
		}
		return formData;
	}

</script>

<style>
    reader {
		display: inline-block;
        width: 100%;
        background-color: black;
    }
	.save-status {
		position: absolute;
		top: 0;
		width: 100%;
	}
</style>

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

		<!--<div
			class="item"
			class:done={item.done}
		>
			<form
				action="/items?_method=PATCH"
				method="post"
				use:enhance={{
					pending: ({ data }) => {
						item.done = !!data.get('done');
					}
				}}
			>
				<input type="hidden" name="id" value={item.id} />
				<input type="hidden" name="done" value={item.done ? '' : 'true'} />
				<button class="toggle" aria-label="Mark item as {item.done ? 'not done' : 'done'}" />
			</form>

			<form class="text" action="/items?_method=PATCH" method="post" use:enhance>
				<input type="hidden" name="id" value={item.id} />
				<input aria-label="Edit item" type="text" name="text" value={item.text} />
				<button class="save" aria-label="Save item" />
			</form>
		</div>-->
</div>

<div class="modal" tabindex="-1" class:d-block={showScanModal}>
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Label for <i>{currentItem?.product.name}</i><br><small>({currentItem?.product.manufacturer})</small></h5>
				<button type="button" class="btn-close" on:click={() => closeScanModal()}></button>
			</div>
			<div class="modal-body">
				<reader id="reader" class:invisible={scanStatus !== "scanning"}/>
				{ #if scanStatus === "saving"}
					<div class="d-flex justify-content-center align-items-center h-100 save-status">
						<div class="spinner spinner-border text-success"></div>
					</div>
				{ /if }
			</div>
			<div class="modal-footer d-flex justify-content-end">
				<button type="button" class="btn btn-outline-secondary">Next</button>
			</div>
		</div>
	</div>
</div>
{#if showScanModal}
	<div class="modal-backdrop fade show"></div>
{/if}