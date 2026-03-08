<script lang="ts">
	import { getAccount } from '$lib/appwrite';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();
	let error = $state('');

	onMount(async () => {
		try {
			// Create session CLIENT-SIDE so Appwrite records the user's real
			// IP / user-agent instead of the server's.
			const account = getAccount();
			const session = await account.createSession(data.userId, data.secret);

			// Send session info to server to persist in an httpOnly cookie
			const res = await fetch('/auth/callback/set-session', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					userId: data.userId,
					sessionId: session.$id,
					secret: session.secret
				})
			});

			if (res.ok) {
				goto('/admin');
			} else {
				error = 'Failed to save session. Please try again.';
			}
		} catch (err: any) {
			console.error('Session creation failed:', err);
			goto('/auth/login?error=failed');
		}
	});
</script>

<div class="min-h-screen flex items-center justify-center">
	{#if error}
		<p class="text-red-500">{error}</p>
	{:else}
		<p class="text-slate-400">Authenticating...</p>
	{/if}
</div>
