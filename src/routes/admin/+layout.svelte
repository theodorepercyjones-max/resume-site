<script lang="ts">
	let { children } = $props();
</script>

<header class="bg-[var(--color-navy)] text-white py-4">
	<div class="max-w-[960px] mx-auto px-6 flex justify-between items-center">
		<span class="font-semibold">Admin Dashboard</span>
		<nav class="flex gap-4 text-sm">
			<a href="/" class="text-slate-400 hover:text-white">View Site</a>
			<a href="/auth/logout" class="text-slate-400 hover:text-white">Logout</a>
		</nav>
	</div>
</header>

<main class="max-w-[960px] mx-auto px-6 py-6 bg-[var(--color-cream)] min-h-screen">
	{@render children()}
</main>
