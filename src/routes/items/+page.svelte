<script lang="ts">
	import { enhance } from '$lib/form';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/items/$types';

	export let data: PageData;

	const STATUS = {
		AVAILABLE: { name: "Available", color: "success" },
		LENT: { name: "Lent", color: "warning" },
		USED: { name: "Used", color: "primary" }
	}
</script>

<svelte:head>
	<title>Items</title>
</svelte:head>

<div>
	<h1>Items</h1>
	<form
		action="/items"
		method="post"
		use:enhance={{
			result: async ({ form }) => {
				form.reset();
			}
		}}>
		<table class="table table-sm">
			<thead>
				<tr>
					<th>Category</th>
					<th>Manufacturer</th>
					<th>Name</th>
					<th>Location</th>
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
						<td class="table-{item.currentLocation.color}">{item.currentLocation.name}</td>
						<td class="table-{STATUS[item.status]?.color}">{STATUS[item.status]?.name}</td>
						<td>
							<form
							action="/items?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (item.pending_delete = true)
							}}
						>
							<input type="hidden" name="id" value={item.id} />
							<button class="btn btn-outline-danger" disabled={item.pending_delete}>
								{#if item.pending_delete}
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
	</form>

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
