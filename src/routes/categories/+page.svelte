<script lang="ts">
	import { enhance } from '$lib/form';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/categories/$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Categories</title>
</svelte:head>

<div>
	<h1>Categories</h1>
	<form
		action="/categories"
		method="post"
		use:enhance={{
			result: async ({ form }) => {
				form.reset();
			}
		}}>
		<table class="table table-sm table-striped">
			<thead>
				<tr>
					<th>Name</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.categories as category (category.id)}
					<tr>
						<td>{category.name}</td>
						<td>
							<form
							action="/categories?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (category._pendingDelete = true)
							}}
						>
							<input type="hidden" name="id" value={category.id} />
							<button class="btn btn-outline-danger" disabled={category._pendingDelete}>
								{#if category._pendingDelete}
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
			<tfoot>
				<tr>
					<td>
						<input type="text" name="name" class="form-control" placeholder="Name" />
					</td>
					<td>
						<button type="submit" class="btn btn-outline-primary"><i class="fas fa-plus"></i></button>
					</td>
				</tr> 	
			</tfoot>
		</table>
	</form>

		<!--<div
			class="category"
			class:done={category.done}
		>
			<form
				action="/categories?_method=PATCH"
				method="post"
				use:enhance={{
					pending: ({ data }) => {
						category.done = !!data.get('done');
					}
				}}
			>
				<input type="hidden" name="id" value={category.id} />
				<input type="hidden" name="done" value={category.done ? '' : 'true'} />
				<button class="toggle" aria-label="Mark category as {category.done ? 'not done' : 'done'}" />
			</form>

			<form class="text" action="/categories?_method=PATCH" method="post" use:enhance>
				<input type="hidden" name="id" value={category.id} />
				<input aria-label="Edit category" type="text" name="text" value={category.text} />
				<button class="save" aria-label="Save category" />
			</form>
		</div>-->
</div>
