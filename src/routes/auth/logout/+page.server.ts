import { redirect } from '@sveltejs/kit';
import { Client, Account } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
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
				.setSession(parsed.secret);

			const account = new Account(client);
			await account.deleteSession(parsed.sessionId);
		} catch {
			// Session may already be expired; proceed with cookie cleanup
		}
	}

	cookies.delete('session', { path: '/' });
	redirect(302, '/');
};
