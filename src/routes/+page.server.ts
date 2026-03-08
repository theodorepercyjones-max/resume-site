import { getProfile, getWorkExperiences, getFreelanceWorks, getEducations } from '$lib/server/appwrite';
import { marked } from 'marked';
import type { PageServerLoad } from './$types';

marked.setOptions({ async: false });

function md(text: string | undefined): string {
	if (!text) return '';
	return marked.parse(text) as string;
}

export const load: PageServerLoad = async () => {
	const [profile, workExperiences, freelanceWorks, educations] = await Promise.all([
		getProfile(),
		getWorkExperiences(),
		getFreelanceWorks(),
		getEducations()
	]);

	return {
		profile: profile ? { ...profile, summary: md(profile.summary) } : profile,
		workExperiences: workExperiences.map((exp: any) => ({ ...exp, description: md(exp.description) })),
		freelanceWorks: freelanceWorks.map((work: any) => ({ ...work, description: md(work.description) })),
		educations: educations.map((edu: any) => ({ ...edu, details: md(edu.details) }))
	};
};
