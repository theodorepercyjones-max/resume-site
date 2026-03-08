import { redirect } from '@sveltejs/kit';
import { Client, Account } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');

	const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

	if (!userId || !secret) {
		redirect(302, '/auth/login?error=invalid');
	}

	try {
		// Create the session from the magic URL token
		const client = new Client();
		client.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT).setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID);

		const account = new Account(client);
		const session = await account.createSession(userId, secret);

		// Verify the user's email is authorized BEFORE setting the cookie.
		// This prevents bypass via direct Appwrite API calls — anyone can call
		// createMagicURLToken against the public Appwrite API, but only the
		// authorized email will pass this server-side check.
		const sessionClient = new Client();
		sessionClient
			.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
			.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
			.setSession(session.secret);

		const sessionAccount = new Account(sessionClient);
		const user = await sessionAccount.get();
		const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();

		if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
			// Not authorized — revoke the session and reject
			await sessionAccount.deleteSession(session.$id);
			redirect(302, '/auth/login?error=unauthorized');
		}

		cookies.set('session', JSON.stringify({
			userId,
			sessionId: session.$id,
			secret: session.secret
		}), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: !isLocalhost,
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		redirect(302, '/admin');
	} catch (err: any) {
		if (err?.status === 302) throw err; // re-throw SvelteKit redirects
		redirect(302, '/auth/login?error=failed');
	}
};
