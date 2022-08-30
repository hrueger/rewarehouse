<script lang="ts">
	import { page } from '$app/stores';
	
	let settingsDropdownOpen = false;
</script>

<header>
	<nav class="navbar navbar-expand-lg bg-light">
		<div class="container">
			<a class="navbar-brand" href="/" sveltekit:prefetch>reWarehouse</a>
			<button class="navbar-toggler" type="button">
					<span class="navbar-toggler-icon"></span>
			</button>
			<div class="collapse navbar-collapse" id="navbarSupportedContent">
				<ul class="navbar-nav me-auto mb-2 mb-lg-0">
					<li class="nav-item">
						<a class="nav-link" sveltekit:prefetch class:active={$page.url.pathname === '/'} href="/">Home</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" sveltekit:prefetch  class:active={$page.url.pathname === '/items'} href="/items">Items</a>
					</li>
					<li class="nav-item">
						<a class="nav-link" sveltekit:prefetch  class:active={$page.url.pathname === '/scan'} href="/scan">Ein- / auschecken</a>
					</li>
				</ul>
				<ul class="navbar-nav">
					<li class="nav-item dropdown">
						<a class="nav-link dropdown-toggle" role="button" href="#0" on:click={() => {settingsDropdownOpen = !settingsDropdownOpen}} on:blur={() => setTimeout(() => settingsDropdownOpen = false, 100)}>
							Settings
						</a>
						<ul class="dropdown-menu" class:show={settingsDropdownOpen}>	
							<li>
								<a class="dropdown-item" sveltekit:prefetch on:click={() => settingsDropdownOpen = false} class:active={$page.url.pathname === '/products'} href="/products">Products</a>
							</li>
							<li>
								<a class="dropdown-item" sveltekit:prefetch on:click={() => settingsDropdownOpen = false} class:active={$page.url.pathname === '/labels'} href="/labels">Labels</a>
							</li>
							<li>
								<a class="dropdown-item" sveltekit:prefetch on:click={() => settingsDropdownOpen = false} class:active={$page.url.pathname === '/locations'} href="/locations">Locations</a>
							</li>
							<li>
								<a class="dropdown-item" sveltekit:prefetch on:click={() => settingsDropdownOpen = false} class:active={$page.url.pathname === '/categories'} href="/categories">Categories</a>
							</li>
						</ul>
					</li>			  
				</ul>
			</div>
		</div>
	</nav>
</header>