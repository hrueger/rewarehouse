<script lang="ts">
	import type { Item } from "@prisma/client";
	import { Html5Qrcode } from "html5-qrcode";
	import { createEventDispatcher, onMount } from "svelte";
	import Modal from "./Modal.svelte";

	const dispatch = createEventDispatcher();

	export let items: any[] = [];
	let currentItem: Item & { [key: string]: any };
	
	async function closeModal() {
		scanStatus = "saving";
		await stop();
		scannedLabels = new Set();
		dispatch("close");
	}
	
    let html5Qrcode: Html5Qrcode;
	let showScanModal = false;
	let scanStatus: "scanning" | "saving" = "scanning";
	let scannedLabels = new Set<string>();

    onMount(() => {
		html5Qrcode = new Html5Qrcode('reader');
	});

	export const methods = {
		async start(item: any) {
			currentItem = item;
			scanStatus = "scanning";
			html5Qrcode.start(
				{ facingMode: 'environment' },
				{
					fps: 10,
					qrbox: { width: 250, height: 100 },
				},
				onScanSuccess,
				() => undefined,
			);
			showScanModal = true;
		},
		async nextItem(): Promise<void> {
			currentItem = items[items.findIndex((i) => i.id === currentItem.id) + 1];
			if (currentItem) {
				scanStatus = "scanning";
			} else {
				await stop();
			}
		}
	}

    async function stop() {
		showScanModal = false;
        await html5Qrcode.stop()
    }

    async function onScanSuccess(decodedText: string, decodedResult: unknown) {
		if (scannedLabels.has(decodedText)) {
			return;
		}
		scannedLabels.add(decodedText);
		scanStatus = "saving";
		dispatch("scanResult", { item: currentItem, label: decodedText });
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

<Modal on:close={() => closeModal()} hidden={!showScanModal}>
	<div slot="title">
		Label for <i>{currentItem?.product.name}</i><br><small>({currentItem?.product.manufacturer})</small>
	</div>
	<div slot="body">
		<reader id="reader" class:invisible={scanStatus !== "scanning"}/>
		{ #if scanStatus === "saving"}
			<div class="d-flex justify-content-center align-items-center h-100 save-status">
				<div class="spinner spinner-border text-success"></div>
			</div>
		{ /if }
	</div>
	<div slot="footer">
		<!--<button type="button" class="btn btn-outline-secondary">Next</button>-->
	</div>
</Modal>