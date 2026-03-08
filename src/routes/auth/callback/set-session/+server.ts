import { json } from '@sveltejs/kit';
import { Client, Users } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const { userId, sessionId, secret } = await request.json();

	if (!userId || !sessionId) {
		return json({ error: 'Missing session data' }, { status: 400 });
	}

	// Verify the session actually exists and belongs to the authorized admin
	try {
		const client = new Client();
		client
			.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
			.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
			.setKey(env.APPWRITE_API_KEY);

		const users = new Users(client);

		// Check user is the authorized admin
		const user = await users.get(userId);
		const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
		if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		// Check the session exists
		const { sessions } = await users.listSessions(userId);
		if (!sessions.some((s: { $id: string }) => s.$id === sessionId)) {
			return json({ error: 'Session not found' }, { status: 401 });
		}
	} catch {
		return json({ error: 'Verification failed' }, { status: 500 });
	}

	const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

	cookies.set('session', JSON.stringify({
		userId,
		sessionId,
		secret: secret || ''
	}), {
		path: '/',
		httpOnly: true,
		sameSite: 'lax',
		secure: !isLocalhost,
		maxAge: 60 * 60 * 24 * 7 // 7 days
	});

	return json({ success: true });
};
