import { redirect } from '@sveltejs/kit';
import { Client, Account } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const raw = cookies.get('session');
	if (!raw) {
		redirect(302, '/auth/login');
	}

	let parsed: { userId: string; sessionId: string; secret: string };
	try {
		parsed = JSON.parse(raw);
	} catch {
		cookies.delete('session', { path: '/' });
		redirect(302, '/auth/login');
	}

	try {
		const client = new Client();
		client
			.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
			.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
			.setSession(parsed.secret);

		const account = new Account(client);
		await account.get();
	} catch {
		cookies.delete('session', { path: '/' });
		redirect(302, '/auth/login');
	}
};
