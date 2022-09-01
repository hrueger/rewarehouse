<script lang="ts">
    import { createEventDispatcher } from "svelte";

	export let hidden = false;
	export let size: "sm" | "md" | "lg" | "xl" = "md";


    const dispatch = createEventDispatcher();

    function closeModal() {
        hidden = true;
        dispatch("close");
    }
</script>


<div class="modal" tabindex="-1" class:d-block={!hidden}>
	<div class="modal-dialog modal-{size}">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title"><slot name="title"></slot></h5>
				<button type="button" class="btn-close" on:click={() => closeModal()}></button>
			</div>
			<div class="modal-body">
				<slot name="body"></slot>
			</div>
			<div class="modal-footer d-flex justify-content-end">
				<slot name="footer"></slot>
			</div>
		</div>
	</div>
</div>
{#if !hidden}
	<div class="modal-backdrop fade show"></div>
{/if}