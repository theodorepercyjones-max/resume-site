import { redirect } from '@sveltejs/kit';
import { Client, Account } from 'node-appwrite';
import { env } from '$env/dynamic/public';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, cookies }) => {
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');

	if (!userId || !secret) {
		redirect(302, '/auth/login?error=invalid');
	}

	try {
		const client = new Client();
		client.setEndpoint(env.PUBLIC_APPWRITE_ENDPOINT).setProject(env.PUBLIC_APPWRITE_PROJECT_ID);

		const account = new Account(client);
		const session = await account.createSession(userId, secret);

		cookies.set('session', JSON.stringify({
			userId,
			sessionId: session.$id,
			secret: session.secret
		}), {
			path: '/',
			httpOnly: true,
			sameSite: 'lax',
			secure: false,
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		redirect(302, '/admin');
	} catch (err: any) {
		redirect(302, '/auth/login?error=failed');
	}
};
