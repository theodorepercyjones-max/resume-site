import { redirect, fail } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
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

		const adminEmail = env.ADMIN_EMAIL?.trim().toLowerCase();
		if (!adminEmail || email !== adminEmail) {
			return fail(403, { error: 'This email is not authorized to access the admin area.' });
		}

		return { validated: true };
	}
};
