<script lang="ts">
	import { enhance } from '$lib/form';
	import type { PageData } from '../../../.svelte-kit/types/src/routes/locations/$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Locations</title>
</svelte:head>

<div>
	<h1>Locations</h1>
	<form
		action="/locations"
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
					<th>Color</th>
					<th>Default</th>
					<th></th>
				</tr>
			</thead>
			<tbody>
				{#each data.locations as location (location.id)}
					<tr>
						<td>{location.name}</td>
						<td class="table-{location.color}">{location.color}</td>
						<td>
							<div class="form-check">
								<input class="form-check-input" type="radio" name="defaultLocation" id="default{location.id}">
								<label class="form-check-label" for="default{location.id}">
								  Default
								</label>
							</div>
						</td>
						<td>
							<form
							action="/locations?_method=DELETE"
							method="post"
							use:enhance={{
								pending: () => (location._pendingDelete = true)
							}}
						>
							<input type="hidden" name="id" value={location.id} />
							<button class="btn btn-outline-danger" disabled={location._pendingDelete}>
								{#if location._pendingDelete}
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
						<input type="text" name="color" class="form-control" placeholder="Color" />
					</td>
					<td>
					<td>
						<button type="submit" class="btn btn-outline-primary"><i class="fas fa-plus"></i></button>
					</td>
				</tr> 	
			</tfoot>
		</table>
	</form>

		<!--<div
			class="location"
			class:done={location.done}
		>
			<form
				action="/locations?_method=PATCH"
				method="post"
				use:enhance={{
					pending: ({ data }) => {
						location.done = !!data.get('done');
					}
				}}
			>
				<input type="hidden" name="id" value={location.id} />
				<input type="hidden" name="done" value={location.done ? '' : 'true'} />
				<button class="toggle" aria-label="Mark location as {location.done ? 'not done' : 'done'}" />
			</form>

			<form class="text" action="/locations?_method=PATCH" method="post" use:enhance>
				<input type="hidden" name="id" value={location.id} />
				<input aria-label="Edit location" type="text" name="text" value={location.text} />
				<button class="save" aria-label="Save location" />
			</form>
		</div>-->
</div>
