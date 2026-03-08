import { redirect } from '@sveltejs/kit';
import { Users } from 'node-appwrite';
import { getAdminClient, isAdminTeamMember } from '$lib/server/appwrite';
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
		// Verify session is active AND user is still in the Admins team
		const users = new Users(getAdminClient());
		const { sessions } = await users.listSessions(parsed.userId);
		if (!sessions.some((s: { $id: string }) => s.$id === parsed.sessionId)) {
			throw new Error('Session not found');
		}

		if (!(await isAdminTeamMember(parsed.userId))) {
			throw new Error('Not a team member');
		}
	} catch {
		cookies.delete('session', { path: '/' });
		redirect(302, '/auth/login');
	}
};
