import { redirect } from '@sveltejs/kit';
import { Client, Users } from 'node-appwrite';
import { env as publicEnv } from '$env/dynamic/public';
import { env } from '$env/dynamic/private';
import type { PageServerLoad } from './$types';

function getAdminClient() {
	const client = new Client();
	client
		.setEndpoint(publicEnv.PUBLIC_APPWRITE_ENDPOINT)
		.setProject(publicEnv.PUBLIC_APPWRITE_PROJECT_ID)
		.setKey(env.APPWRITE_API_KEY);
	return client;
}

export const load: PageServerLoad = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');

	if (!userId || !secret) {
		redirect(302, '/auth/login?error=invalid');
	}

	// Verify the user's email is authorized BEFORE allowing session creation.
	// This prevents bypass via direct Appwrite API calls — anyone can call
	// createMagicURLToken against the public Appwrite API, but only the
	// authorized email will pass this server-side check.
	try {
		const users = new Users(getAdminClient());
		const user = await users.get(userId);
		const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();

		if (!adminEmail || user.email.toLowerCase() !== adminEmail) {
			redirect(302, '/auth/login?error=unauthorized');
		}
	} catch (err: any) {
		if (err?.status === 302) throw err;
		redirect(302, '/auth/login?error=failed');
	}

	// Pass credentials to client for client-side session creation.
	// The secret is the magic URL token (already in the URL); once consumed
	// by createSession it cannot be reused.
	return { userId, secret };
};
