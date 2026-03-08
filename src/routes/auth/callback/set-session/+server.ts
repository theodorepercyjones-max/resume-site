import { json } from '@sveltejs/kit';
import { Users } from 'node-appwrite';
import { getAdminClient, isAdminTeamMember } from '$lib/server/appwrite';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, cookies, url }) => {
	const { userId, sessionId, secret } = await request.json();

	if (!userId || !sessionId) {
		return json({ error: 'Missing session data' }, { status: 400 });
	}

	// Verify the user is in the Admins team and the session is real
	try {
		if (!(await isAdminTeamMember(userId))) {
			return json({ error: 'Unauthorized' }, { status: 403 });
		}

		const users = new Users(getAdminClient());
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
