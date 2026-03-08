import { redirect, fail } from '@sveltejs/kit';
import { findUserByEmail, isAdminTeamMember } from '$lib/server/appwrite';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	if (cookies.get('session')) {
		redirect(302, '/admin');
	}
};

export const actions: Actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const email = data.get('email')?.toString().trim().toLowerCase();

		if (!email) {
			return fail(400, { error: 'Please enter an email address.' });
		}

		// Check that user exists AND is a member of the Admins team
		const user = await findUserByEmail(email);
		if (!user || !(await isAdminTeamMember(user.$id))) {
			return fail(403, { error: 'This email is not authorized to access the admin area.' });
		}

		return { validated: true };
	}
};
