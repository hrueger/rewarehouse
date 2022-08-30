<script lang="ts">
	import { enhance } from '$lib/form';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/products/$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Products</title>
</svelte:head>

<div>
	<h1>Products</h1>
	<form
		action="/products"
		method="post"
		use:enhance={{
			result: async ({ form }) => {
				form.reset();
			}
		}}>
		<table class="table table-sm table-striped">
			<thead>
				<tr>
					<th>Category</th>
					<th>Manufacturer</th>
					<th>Name</th>
					<th>Price</th>
					<th>Count</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.products as product (product.id)}
					<tr>
						<td>{product.category.name}</td>
						<td>{product.manufacturer}</td>
						<td>{product.name}</td>
						<td>{product.price} €</td>
						<td>{product._count.items}</td>
						<td>
							<form
							action="/products?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (product._pendingDelete = true)
							}}
						>
							<input type="hidden" name="id" value={product.id} />
							<button class="btn btn-outline-danger" disabled={product._pendingDelete}>
								{#if product._pendingDelete}
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
						<select class="form-select" name="category">
							{#each data.categories as category (category.id)}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>

					</td>
					<td>
						<input type="text" name="manufacturer" class="form-control" placeholder="Manufacturer" list="manufacturers"/>
						<datalist>
							{#each data.manufacturers as manufacturer (manufacturer)}
								<option value={manufacturer}>{manufacturer}</option>
							{/each}
						</datalist>

					</td>
					<td>
						<input type="text" name="name" class="form-control" placeholder="Name" />
					</td>
					<td>
						<input type="number" name="price" class="form-control" min="0" max="10000" step="0.01" placeholder="Price" />
					</td>
					<td></td>
					<td>
						<button type="submit" class="btn btn-outline-primary"><i class="fas fa-plus"></i></button>
					</td>
				</tr> 	
			</tfoot>
		</table>
	</form>

		<!--<div
			class="product"
			class:done={product.done}
		>
			<form
				action="/products?_method=PATCH"
				method="post"
				use:enhance={{
					pending: ({ data }) => {
						product.done = !!data.get('done');
					}
				}}
			>
				<input type="hidden" name="id" value={product.id} />
				<input type="hidden" name="done" value={product.done ? '' : 'true'} />
				<button class="toggle" aria-label="Mark product as {product.done ? 'not done' : 'done'}" />
			</form>

			<form class="text" action="/products?_method=PATCH" method="post" use:enhance>
				<input type="hidden" name="id" value={product.id} />
				<input aria-label="Edit product" type="text" name="text" value={product.text} />
				<button class="save" aria-label="Save product" />
			</form>
		</div>-->
</div>
