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

	const endpoint = publicEnv.PUBLIC_APPWRITE_ENDPOINT;
	const projectId = publicEnv.PUBLIC_APPWRITE_PROJECT_ID;

	if (!endpoint || !projectId) {
		redirect(302, '/auth/login?error=config');
	}

	// Step 1: Create session from magic URL token
	let session;
	try {
		const client = new Client();
		client.setEndpoint(endpoint).setProject(projectId);
		const account = new Account(client);
		session = await account.createSession(userId, secret);
	} catch (err: any) {
		console.error('Callback: createSession failed:', err?.message);
		redirect(302, '/auth/login?error=session');
	}

	// Step 2: Verify the user's email is authorized BEFORE setting the cookie.
	// This prevents bypass via direct Appwrite API calls — anyone can call
	// createMagicURLToken against the public Appwrite API, but only the
	// authorized email will pass this server-side check.
	try {
		const sessionClient = new Client();
		sessionClient
			.setEndpoint(endpoint)
			.setProject(projectId)
			.setSession(session.secret);

		const sessionAccount = new Account(sessionClient);
		const user = await sessionAccount.get();
		const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();

		if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
			// Not authorized — revoke the session and reject
			await sessionAccount.deleteSession(session.$id);
			redirect(302, '/auth/login?error=unauthorized');
		}
	} catch (err: any) {
		if (err?.status === 302) throw err;
		console.error('Callback: email verification failed:', err?.message);
		redirect(302, '/auth/login?error=verify');
	}

	// Step 3: Set cookie and redirect
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
};
