import { getProfile, getWorkExperiences, getFreelanceWorks, getEducations } from '$lib/server/appwrite';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const [profile, workExperiences, freelanceWorks, educations] = await Promise.all([
		getProfile(),
		getWorkExperiences(),
		getFreelanceWorks(),
		getEducations()
	]);

	return { profile, workExperiences, freelanceWorks, educations };
};
