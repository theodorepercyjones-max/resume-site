import { redirect } from '@sveltejs/kit';
import { Client, Users } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	const raw = cookies.get('session');
	if (raw) {
		try {
			const parsed = JSON.parse(raw);
			const client = new Client();
			client
				.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
				.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
				.setKey(env.APPWRITE_API_KEY);

			const users = new Users(client);
			await users.deleteSession(parsed.userId, parsed.sessionId);
		} catch {
			// Session may already be expired; proceed with cookie cleanup
		}
	}

	cookies.delete('session', { path: '/' });
	redirect(302, '/');
};
