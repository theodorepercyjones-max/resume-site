<script lang="ts">
	import { getAccount } from '$lib/appwrite';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';

	let email = $state('');
	let message = $state('');
	let messageType = $state<'info' | 'danger'>('info');
	let loading = $state(false);

	const errorMessages: Record<string, string> = {
		unauthorized: 'This email is not authorized to access the admin area.',
		invalid: 'Invalid login link. Please try again.',
		failed: 'Login failed. Please try again.'
	};

	let urlError = $derived(page.url.searchParams.get('error'));
	let displayMessage = $derived(message || (urlError ? errorMessages[urlError] || 'Login failed.' : ''));
	let displayType = $derived(message ? messageType : 'danger');
</script>

<svelte:head>
	<title>Admin Login</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-light)]">
	<div class="bg-white rounded-lg p-10 w-full max-w-[400px] shadow-xl">
		<h2 class="font-[var(--font-serif)] text-2xl text-center text-[var(--color-navy)] mb-6">Admin Login</h2>

		{#if displayMessage}
			<div class="rounded-lg px-4 py-3 mb-4 text-sm {displayType === 'info' ? 'bg-blue-50 text-blue-800 border border-blue-200' : 'bg-red-50 text-red-800 border border-red-200'}">
				{displayMessage}
			</div>
		{/if}

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				message = '';

				return async ({ result }) => {
					if (result.type === 'success') {
						try {
							const account = getAccount();
							await account.createMagicURLToken(
								'unique()',
								email,
								`${window.location.origin}/auth/callback`
							);
							message = 'Check your email for the magic link.';
							messageType = 'info';
						} catch (err: any) {
							message = err?.message || 'Login failed. Please try again.';
							messageType = 'danger';
						}
					} else if (result.type === 'failure') {
						message = (result.data as any)?.error || 'Login failed. Please try again.';
						messageType = 'danger';
					}
					loading = false;
				};
			}}
		>
			<label for="email" class="block text-sm font-semibold text-slate-600 mb-1">Email Address</label>
			<input
				type="email"
				id="email"
				name="email"
				bind:value={email}
				required
				class="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-amber-100 mb-4"
				placeholder="admin@example.com"
			/>
			<button
				type="submit"
				disabled={loading}
				class="w-full bg-[var(--color-accent)] hover:bg-amber-700 text-white font-semibold py-2.5 rounded-md transition-colors disabled:opacity-50"
			>
				{loading ? 'Sending...' : 'Send Magic Link'}
			</button>
		</form>

		<div class="text-center mt-4">
			<a href="/" class="text-sm text-slate-400 hover:text-[var(--color-navy)]">&larr; Back to site</a>
		</div>
	</div>
</div>
