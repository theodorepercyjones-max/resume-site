import { redirect } from '@sveltejs/kit';
import { Client, Users } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
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
			.setKey(env.APPWRITE_API_KEY);

		const users = new Users(client);
		const { sessions } = await users.listSessions(parsed.userId);
		if (!sessions.some((s: { $id: string }) => s.$id === parsed.sessionId)) {
			throw new Error('Session not found');
		}
	} catch {
		cookies.delete('session', { path: '/' });
		redirect(302, '/auth/login');
	}
};
