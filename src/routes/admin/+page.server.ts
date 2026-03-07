import {
	getProfile, createProfile, updateProfile,
	getWorkExperiences, createWorkExperience, updateWorkExperience, deleteWorkExperience,
	getFreelanceWorks, createFreelanceWork, updateFreelanceWork, deleteFreelanceWork,
	getEducations, createEducation, updateEducation, deleteEducation,
	getTodos, createTodo, updateTodo, deleteTodo
} from '$lib/server/appwrite';
import { fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const [profile, workExperiences, freelanceWorks, educations, todos] = await Promise.all([
		getProfile(),
		getWorkExperiences(),
		getFreelanceWorks(),
		getEducations(),
		getTodos()
	]);

	return { profile, workExperiences, freelanceWorks, educations, todos };
};

export const actions: Actions = {
	updateProfile: async ({ request }) => {
		const form = await request.formData();
		const data = {
			full_name: form.get('full_name') as string || '',
			title: form.get('title') as string || '',
			summary: form.get('summary') as string || '',
			location: form.get('location') as string || '',
			nationality: form.get('nationality') as string || '',
			seeking_role: form.get('seeking_role') as string || '',
			freelance_status: form.get('freelance_status') as string || 'not_accepting'
		};

		const profile = await getProfile();
		if (profile) {
			await updateProfile(profile.$id, data);
		} else {
			await createProfile(data);
		}

		return { success: true, message: 'Profile updated.' };
	},

	saveWorkExperience: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const data = {
			employer: form.get('employer') as string || '',
			jobtitle: form.get('jobtitle') as string || '',
			location: form.get('location') as string || '',
			start_date: form.get('start_date') as string || '',
			end_date: form.get('end_date') as string || '',
			description: form.get('description') as string || '',
			sort_order: parseInt(form.get('sort_order') as string || '0')
		};

		if (docId) {
			await updateWorkExperience(docId, data);
		} else {
			await createWorkExperience(data);
		}

		return { success: true, message: 'Work experience saved.' };
	},

	deleteWorkExperience: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		if (docId) await deleteWorkExperience(docId);
		return { success: true, message: 'Work experience deleted.' };
	},

	saveFreelanceWork: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const data = {
			project_name: form.get('project_name') as string || '',
			client_name: form.get('client_name') as string || '',
			description: form.get('description') as string || '',
			testimonial: form.get('testimonial') as string || '',
			portfolio_url: form.get('portfolio_url') as string || '',
			sort_order: parseInt(form.get('sort_order') as string || '0')
		};

		if (docId) {
			await updateFreelanceWork(docId, data);
		} else {
			await createFreelanceWork(data);
		}

		return { success: true, message: 'Freelance work saved.' };
	},

	deleteFreelanceWork: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		if (docId) await deleteFreelanceWork(docId);
		return { success: true, message: 'Freelance work deleted.' };
	},

	saveEducation: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const data = {
			university: form.get('university') as string || '',
			degree: form.get('degree') as string || '',
			majors: form.get('majors') as string || '',
			details: form.get('details') as string || '',
			start_date: form.get('start_date') as string || '',
			end_date: form.get('end_date') as string || '',
			sort_order: parseInt(form.get('sort_order') as string || '0')
		};

		if (docId) {
			await updateEducation(docId, data);
		} else {
			await createEducation(data);
		}

		return { success: true, message: 'Education saved.' };
	},

	deleteEducation: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		if (docId) await deleteEducation(docId);
		return { success: true, message: 'Education deleted.' };
	},

	saveTodo: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const data = {
			title: form.get('title') as string || '',
			completed: form.get('completed') === 'true',
			sort_order: parseInt(form.get('sort_order') as string || '0')
		};

		if (docId) {
			await updateTodo(docId, data);
		} else {
			await createTodo(data);
		}

		return { success: true, message: 'Todo saved.' };
	},

	toggleTodo: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const completed = form.get('completed') === 'true';
		if (docId) await updateTodo(docId, { completed: !completed });
		return { success: true };
	},

	deleteTodo: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		if (docId) await deleteTodo(docId);
		return { success: true, message: 'Todo deleted.' };
	}
};
