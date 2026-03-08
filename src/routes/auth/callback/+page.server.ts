import { redirect } from '@sveltejs/kit';
import { isAdminTeamMember } from '$lib/server/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const userId = url.searchParams.get('userId');
	const secret = url.searchParams.get('secret');

	if (!userId || !secret) {
		redirect(302, '/auth/login?error=invalid');
	}

	// Verify the user is a member of the Admins team BEFORE allowing session creation.
	if (!(await isAdminTeamMember(userId))) {
		redirect(302, '/auth/login?error=unauthorized');
	}

	// Pass credentials to client for client-side session creation.
	return { userId, secret };
};
