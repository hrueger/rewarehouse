<script lang="ts">
	import { enhance } from '$lib/form';
	import { formatLength } from '$lib/helpers';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/products/$types';
	import Modal from "$lib/Modal.svelte";

	export let data: PageData;
	let currentlyEditedProduct: typeof data.products[0] | undefined;
	let pendingSave = false;
</script>

<svelte:head>
	<title>Products</title>
</svelte:head>

<div>
	<h1>Products</h1>
	<table class="table table-sm table-striped">
		<thead>
			<tr>
				<th>Category</th>
				<th>Manufacturer</th>
				<th>Name</th>
				<th>Length / Size</th>
				<th>Price</th>
				<th>Count</th>
				<th>Total</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each data.products as product (product.id)}
				<tr>
					<td>{product.category.name}</td>
					<td>{product.manufacturer}</td>
					<td>{product.name}</td>
					<td>{formatLength(product.length)}</td>
					<td>{product.price} €</td>
					<td>{product._count.items}</td>
					<td>{product.price * product._count.items} €</td>
					<td class="d-flex gap-1">
						<form
							action="/products?_method=PATCH"
							method="post"
							use:enhance={{
								pending: () => (product._pendingCustom = "createItem")
							}}>
							<input type="hidden" name="id" value={product.id} />
							<input type="hidden" name="_action" value="createItem" />
							<button class="btn btn-outline-success" disabled={product._pendingCustom == "createItem"}>
								{#if product._pendingCustom == "createItem"}
									<i class="spinner-border spinner-border-sm"></i>
								{:else}
									<i class="fas fa-plus"></i>
								{/if}
							</button>
						</form>
						<button class="btn btn-outline-primary" on:click={() => currentlyEditedProduct = product}><i class="fas fa-pen"></i></button>
						<form
							action="/products?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (product._pendingDelete = true)
							}}>
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
					<select form="newProductForm" class="form-select" name="category">
						{#each data.categories as category (category.id)}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>

				</td>
				<td>
					<input form="newProductForm" type="text" name="manufacturer" class="form-control" placeholder="Manufacturer" list="manufacturers"/>
					<datalist>
						{#each data.manufacturers as manufacturer (manufacturer)}
							<option value={manufacturer}>{manufacturer}</option>
						{/each}
					</datalist>
				</td>
				<td>
					<input form="newProductForm" type="text" name="name" class="form-control" placeholder="Name" />
				</td>
				<td>
					<input form="newProductForm" type="number" name="length" class="form-control" min="0" max="500" step="0.2" placeholder="Length" />
				</td>
				<td>
					<input form="newProductForm" type="number" name="price" class="form-control" min="0" max="10000" step="0.01" placeholder="Price" />
				</td>
				<td></td>
				<td></td>
				<td>
					<button form="newProductForm" type="submit" class="btn btn-outline-primary"><i class="fas fa-plus"></i></button>
				</td>
			</tr>
		</tfoot>
	</table>
	<form
	id="newProductForm"
	action="/products"
	method="post"
	use:enhance={{
		result: async ({ form }) => {
			form.reset();
		}
	}}>
	</form>
</div>

{#if currentlyEditedProduct}
	<Modal size="lg">
		<div slot="title">Edit Product</div>
		<div slot="body">
			<form class="text" action="/products?_method=PATCH" method="post" use:enhance={{reset: () => currentlyEditedProduct = undefined, pending: () => (currentlyEditedProduct ? currentlyEditedProduct._pendingSave = true : null), result: () => currentlyEditedProduct = undefined}} id="editProductForm">
				<input type="hidden" name="id" value={currentlyEditedProduct.id} />

				<div class="row mb-3">
					<label for="category" class="col-sm-2 col-form-label">Category</label>
					<div class="col-sm-10">
						<select class="form-select" name="category" value={currentlyEditedProduct.categoryId}>
							{#each data.categories as category (category.id)}
								<option value={category.id}>{category.name}</option>
							{/each}
						</select>
					</div>
				</div>

				<div class="row mb-3">
					<label for="manufacturer" class="col-sm-2 col-form-label">Manufacturer</label>
					<div class="col-sm-10">
						<input type="text" name="manufacturer" class="form-control" placeholder="Manufacturer" list="manufacturers"  value={currentlyEditedProduct.manufacturer}/>
						<datalist>
							{#each data.manufacturers as manufacturer (manufacturer)}
								<option value={manufacturer}>{manufacturer}</option>
							{/each}
						</datalist>
					</div>
				</div>

				<div class="row mb-3">
					<label for="name" class="col-sm-2 col-form-label">Name</label>
					<div class="col-sm-10">
						<input type="text" name="name" class="form-control" placeholder="Name"  value={currentlyEditedProduct.name}/>
					</div>
				</div>

				<div class="row mb-3">
					<label for="length" class="col-sm-2 col-form-label">Length</label>
					<div class="col-sm-10">
						<input type="number" name="length" class="form-control" min="0" max="500" step="0.2" placeholder="Length"  value={currentlyEditedProduct.length}/>
					</div>
				</div>

				<div class="row mb-3">
					<label for="price" class="col-sm-2 col-form-label">Price</label>
					<div class="col-sm-10">
						<input type="number" name="price" class="form-control" min="0" max="10000" step="0.01" placeholder="Price"  value={currentlyEditedProduct.price}/>
					</div>
				</div>
			</form>
		</div>
		<div slot="footer">
			<button type="reset" form="editProductForm" class="btn btn-outline-danger" disabled={pendingSave}>Cancel <i class="fas fa-times"></i></button>
			<button type="submit" form="editProductForm" class="btn btn-outline-success" disabled={pendingSave}>Save&nbsp;
				{#if pendingSave}
					<i class="spinner-border spinner-border-sm"></i>
				{:else}
					<i class="fas fa-save"></i>
				{/if}
			</button>
		</div>
	</Modal>
{/if}