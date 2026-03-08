import {
	getProfile, createProfile, updateProfile,
	getWorkExperiences, createWorkExperience, updateWorkExperience, deleteWorkExperience,
	getFreelanceWorks, createFreelanceWork, updateFreelanceWork, deleteFreelanceWork,
	getEducations, createEducation, updateEducation, deleteEducation
} from '$lib/server/appwrite';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async () => {
	const [profile, workExperiences, freelanceWorks, educations] = await Promise.all([
		getProfile(),
		getWorkExperiences(),
		getFreelanceWorks(),
		getEducations()
	]);

	return { profile, workExperiences, freelanceWorks, educations };
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
			freelance_status: form.get('freelance_status') as string || 'not_accepting',
			source_code_url: form.get('source_code_url') as string || ''
		};

		try {
			const profile = await getProfile();
			if (profile) {
				await updateProfile(profile.$id, data);
			} else {
				await createProfile(data);
			}
			return { success: true, message: 'Profile updated.' };
		} catch (e) {
			console.error('updateProfile action error:', e);
			return { success: false, message: `Error saving profile: ${e instanceof Error ? e.message : e}` };
		}
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

		try {
			if (docId) {
				await updateWorkExperience(docId, data);
			} else {
				await createWorkExperience(data);
			}
			return { success: true, message: 'Work experience saved.' };
		} catch (e) {
			console.error('saveWorkExperience action error:', e);
			return { success: false, message: `Error saving work experience: ${e instanceof Error ? e.message : e}` };
		}
	},

	deleteWorkExperience: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		try {
			if (docId) await deleteWorkExperience(docId);
			return { success: true, message: 'Work experience deleted.' };
		} catch (e) {
			console.error('deleteWorkExperience action error:', e);
			return { success: false, message: `Error deleting work experience: ${e instanceof Error ? e.message : e}` };
		}
	},

	moveWorkExperience: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const direction = form.get('direction') as string;
		try {
			const items = await getWorkExperiences();
			const idx = items.findIndex(i => i.$id === docId);
			const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
			if (idx >= 0 && swapIdx >= 0 && swapIdx < items.length) {
				const currentOrder = items[idx].sort_order ?? idx;
				const swapOrder = items[swapIdx].sort_order ?? swapIdx;
				await Promise.all([
					updateWorkExperience(docId, { sort_order: swapOrder }),
					updateWorkExperience(items[swapIdx].$id, { sort_order: currentOrder })
				]);
			}
			return { success: true };
		} catch (e) {
			console.error('moveWorkExperience error:', e);
			return { success: false, message: `Error reordering: ${e instanceof Error ? e.message : e}` };
		}
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

		try {
			if (docId) {
				await updateFreelanceWork(docId, data);
			} else {
				await createFreelanceWork(data);
			}
			return { success: true, message: 'Freelance work saved.' };
		} catch (e) {
			console.error('saveFreelanceWork action error:', e);
			return { success: false, message: `Error saving freelance work: ${e instanceof Error ? e.message : e}` };
		}
	},

	deleteFreelanceWork: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		try {
			if (docId) await deleteFreelanceWork(docId);
			return { success: true, message: 'Freelance work deleted.' };
		} catch (e) {
			console.error('deleteFreelanceWork action error:', e);
			return { success: false, message: `Error deleting freelance work: ${e instanceof Error ? e.message : e}` };
		}
	},

	moveFreelanceWork: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const direction = form.get('direction') as string;
		try {
			const items = await getFreelanceWorks();
			const idx = items.findIndex(i => i.$id === docId);
			const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
			if (idx >= 0 && swapIdx >= 0 && swapIdx < items.length) {
				const currentOrder = items[idx].sort_order ?? idx;
				const swapOrder = items[swapIdx].sort_order ?? swapIdx;
				await Promise.all([
					updateFreelanceWork(docId, { sort_order: swapOrder }),
					updateFreelanceWork(items[swapIdx].$id, { sort_order: currentOrder })
				]);
			}
			return { success: true };
		} catch (e) {
			console.error('moveFreelanceWork error:', e);
			return { success: false, message: `Error reordering: ${e instanceof Error ? e.message : e}` };
		}
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

		try {
			if (docId) {
				await updateEducation(docId, data);
			} else {
				await createEducation(data);
			}
			return { success: true, message: 'Education saved.' };
		} catch (e) {
			console.error('saveEducation action error:', e);
			return { success: false, message: `Error saving education: ${e instanceof Error ? e.message : e}` };
		}
	},

	deleteEducation: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		try {
			if (docId) await deleteEducation(docId);
			return { success: true, message: 'Education deleted.' };
		} catch (e) {
			console.error('deleteEducation action error:', e);
			return { success: false, message: `Error deleting education: ${e instanceof Error ? e.message : e}` };
		}
	},

	moveEducation: async ({ request }) => {
		const form = await request.formData();
		const docId = form.get('doc_id') as string;
		const direction = form.get('direction') as string;
		try {
			const items = await getEducations();
			const idx = items.findIndex(i => i.$id === docId);
			const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
			if (idx >= 0 && swapIdx >= 0 && swapIdx < items.length) {
				const currentOrder = items[idx].sort_order ?? idx;
				const swapOrder = items[swapIdx].sort_order ?? swapIdx;
				await Promise.all([
					updateEducation(docId, { sort_order: swapOrder }),
					updateEducation(items[swapIdx].$id, { sort_order: currentOrder })
				]);
			}
			return { success: true };
		} catch (e) {
			console.error('moveEducation error:', e);
			return { success: false, message: `Error reordering: ${e instanceof Error ? e.message : e}` };
		}
	}
};
